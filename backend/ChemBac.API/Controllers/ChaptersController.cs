using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Lesson;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChemBac.API.Controllers;

[Route("api/chapter")]
[ApiController]
public class ChaptersController : ControllerBase
{
    [HttpGet("getAll")]
    public IActionResult GetAll()
    {
        using var db = new LessonContext();
        var chapters = db.Chapters
            .AsNoTracking()
            .OrderBy(c => c.Order)
            .ThenBy(c => c.Title)
            .Select(c => new ChapterDto
            {
                Id = c.Id,
                Title = c.Title,
                Profile = c.Profile,
                Order = c.Order
            })
            .ToList();

        return Ok(chapters);
    }

    [HttpGet]
    public IActionResult GetById(int id)
    {
        using var db = new LessonContext();
        var chapter = db.Chapters
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new ChapterDto
            {
                Id = c.Id,
                Title = c.Title,
                Profile = c.Profile,
                Order = c.Order
            })
            .FirstOrDefault();

        return chapter == null
            ? NotFound(new { message = $"Capitolul cu id-ul {id} nu a fost gasit." })
            : Ok(chapter);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult Create([FromBody] ChapterDto data)
    {
        if (string.IsNullOrWhiteSpace(data.Title))
            return BadRequest(new { isSuccess = false, message = "Titlul capitolului este obligatoriu." });

        using var db = new LessonContext();
        var chapter = new Chapter
        {
            Title = data.Title.Trim(),
            Profile = string.IsNullOrWhiteSpace(data.Profile) ? "general" : data.Profile.Trim(),
            Order = data.Order
        };

        db.Chapters.Add(chapter);
        db.SaveChanges();

        return Ok(new ChapterDto
        {
            Id = chapter.Id,
            Title = chapter.Title,
            Profile = chapter.Profile,
            Order = chapter.Order
        });
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public IActionResult Update([FromBody] ChapterDto data)
    {
        using var db = new LessonContext();
        var chapter = db.Chapters.FirstOrDefault(c => c.Id == data.Id);
        if (chapter == null)
            return NotFound(new { message = $"Capitolul cu id-ul {data.Id} nu a fost gasit." });

        if (string.IsNullOrWhiteSpace(data.Title))
            return BadRequest(new { isSuccess = false, message = "Titlul capitolului este obligatoriu." });

        chapter.Title = data.Title.Trim();
        chapter.Profile = string.IsNullOrWhiteSpace(data.Profile) ? "general" : data.Profile.Trim();
        chapter.Order = data.Order;

        db.SaveChanges();
        return Ok(data);
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(int id)
    {
        using var db = new LessonContext();
        var chapter = db.Chapters.FirstOrDefault(c => c.Id == id);
        if (chapter == null)
            return NotFound(new { message = $"Capitolul cu id-ul {id} nu a fost gasit." });

        db.Chapters.Remove(chapter);
        db.SaveChanges();
        return Ok(new { isSuccess = true, message = "Capitolul a fost sters." });
    }
}
