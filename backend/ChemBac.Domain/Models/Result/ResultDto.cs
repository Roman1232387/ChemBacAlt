namespace ChemBac.Domain.Models.Result;

public class ResultDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int TestId { get; set; }
    public int Score { get; set; }
    public int MaxScore { get; set; }
    public int Percentage { get; set; }
    public bool Passed { get; set; }
    public string AnswersJson { get; set; } = string.Empty;
    public string QuestionResultsJson { get; set; } = string.Empty;
    public DateTime StartedAt { get; set; }
    public DateTime CompletedAt { get; set; }
    public int Duration { get; set; }
}
