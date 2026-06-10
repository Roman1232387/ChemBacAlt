using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChemBac.Domain.Entities;

public class Question
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public string Text { get; set; } = string.Empty;

    [StringLength(20)]
    public string Type { get; set; } = "single";

    public string Explanation { get; set; } = string.Empty;

    public int Points { get; set; } = 1;

    public int TestId { get; set; }
    public Test Test { get; set; } = null!;

    public ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    public ICollection<QuestionStep> Steps { get; set; } = new List<QuestionStep>();
}
