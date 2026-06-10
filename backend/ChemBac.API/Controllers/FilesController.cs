using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ChemBac.API.Controllers;

[Route("api/files")]
[ApiController]
public class FilesController : ControllerBase
{
    private static readonly Dictionary<string, string> AllowedMimeTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        { ".pdf", "application/pdf" },
        { ".docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
        { ".png", "image/png" },
        { ".jpg", "image/jpeg" },
        { ".jpeg", "image/jpeg" }
    };

    private const long MaxFileSize = 10 * 1024 * 1024;

    [HttpPost("upload")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] string category = "general")
    {
        if (file.Length == 0)
            return BadRequest(new { message = "Fișierul este gol." });

        if (file.Length > MaxFileSize)
            return BadRequest(new { message = "Fișierul depășește limita de 10MB." });

        var extension = Path.GetExtension(file.FileName);
        if (!AllowedMimeTypes.TryGetValue(extension, out var expectedMimeType))
            return BadRequest(new { message = "Extensie nepermisă. Sunt acceptate .pdf, .docx, .png, .jpg, .jpeg." });

        if (!string.Equals(file.ContentType, expectedMimeType, StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = $"Tipul de conținut ({file.ContentType}) nu corespunde extensiei ({extension})." });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        var safeOriginalName = Path.GetFileName(file.FileName);
        var storedName = $"{Guid.NewGuid():N}_{safeOriginalName}";
        var fullPath = Path.Combine(uploadsPath, storedName);

        await using (var stream = System.IO.File.Create(fullPath))
        {
            await file.CopyToAsync(stream);
        }

        var userIdClaim = User.FindFirst("userId")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var uploadedBy = int.TryParse(userIdClaim, out var userId) ? userId : 0;
        var uploaded = new UploadedFile
        {
            OriginalName = safeOriginalName,
            StoredName = storedName,
            Url = $"/uploads/{storedName}",
            FileType = GetFileType(extension),
            SizeBytes = file.Length,
            Category = string.IsNullOrWhiteSpace(category) ? "general" : category.Trim(),
            UploadedAt = DateTime.UtcNow,
            UploadedByUserId = uploadedBy
        };

        using var db = new FileContext();
        db.UploadedFiles.Add(uploaded);
        db.SaveChanges();

        return Ok(new { uploaded.Id, uploaded.Url, uploaded.OriginalName });
    }

    [HttpGet]
    [Authorize]
    public IActionResult GetAll()
    {
        using var db = new FileContext();
        var files = db.UploadedFiles
            .AsNoTracking()
            .OrderByDescending(f => f.UploadedAt)
            .ToList();

        return Ok(files);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(int id)
    {
        using var db = new FileContext();
        var file = db.UploadedFiles.FirstOrDefault(f => f.Id == id);
        if (file == null)
            return NotFound(new { message = $"Fișierul cu id-ul {id} nu a fost găsit." });

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        var fullPath = Path.Combine(uploadsPath, file.StoredName);
        if (System.IO.File.Exists(fullPath))
            System.IO.File.Delete(fullPath);

        db.UploadedFiles.Remove(file);
        db.SaveChanges();

        return Ok(new { isSuccess = true, message = "Fișierul a fost șters." });
    }

    private static string GetFileType(string extension)
    {
        return extension.ToLowerInvariant() switch
        {
            ".pdf" => "pdf",
            ".docx" => "docx",
            ".png" or ".jpg" or ".jpeg" => "image",
            _ => "general"
        };
    }
}
