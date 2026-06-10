namespace ChemBac.Domain.Models.Test;

public class QuestionOptionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class QuestionStepDto
{
    public int Id { get; set; }
    public int QuestionId { get; set; }
    public int Order { get; set; }
    public string Prompt { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public string StepType { get; set; } = "numeric";
    public double Tolerance { get; set; } = 0.01;
    public int Points { get; set; } = 1;
    public string? Unit { get; set; }
}

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string Type { get; set; } = "single";
    public string Explanation { get; set; } = string.Empty;
    public int Points { get; set; } = 1;
    public List<QuestionOptionDto> Options { get; set; } = new();
    public List<QuestionStepDto> Steps { get; set; } = new();
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
