namespace ChemBac.Domain.Entities;

public class QuestionStep
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
    public Question Question { get; set; } = null!;
}
