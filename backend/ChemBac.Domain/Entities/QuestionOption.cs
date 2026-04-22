using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChemBac.Domain.Entities;

public class QuestionOption
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [StringLength(500)]
    public string Text { get; set; } = string.Empty;

    public bool IsCorrect { get; set; }

    public int QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}
