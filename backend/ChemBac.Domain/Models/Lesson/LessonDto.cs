namespace ChemBac.Domain.Models.Lesson;

public class LessonSectionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Formula { get; set; } = string.Empty;
    public int Order { get; set; }
    public string Type { get; set; } = "text";
    public string? ImageUrl { get; set; }
    public string? TableJson { get; set; }
}

public class ChapterDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Profile { get; set; } = "general";
    public int Order { get; set; }
}

public class LessonDto
{
    public int Id { get; set; }
    public int? ChapterId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Duration { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<LessonSectionDto> Sections { get; set; } = new();
}
