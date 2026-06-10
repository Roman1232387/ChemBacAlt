namespace ChemBac.Domain.Entities;

public class UploadedFile
{
    public int Id { get; set; }
    public string OriginalName { get; set; } = string.Empty;
    public string StoredName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string FileType { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
    public string Category { get; set; } = "general";
    public DateTime UploadedAt { get; set; }
    public int UploadedByUserId { get; set; }
}
