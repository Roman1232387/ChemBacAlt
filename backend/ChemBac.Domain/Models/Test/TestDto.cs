namespace ChemBac.Domain.Models.Test;

public class QuestionOptionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Type { get; set; } = "single";
    public string Explanation { get; set; } = string.Empty;
    public int Points { get; set; } = 1;
    public List<QuestionOptionDto> Options { get; set; } = new();
}

public class TestDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int PassingScore { get; set; }
    public string Status { get; set; } = "draft";
    public int LessonId { get; set; }
    public int CreatedById { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<QuestionDto> Questions { get; set; } = new();
}
