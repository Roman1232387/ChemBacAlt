namespace ChemBac.Domain.Entities;

public class Chapter
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Profile { get; set; } = "general";
    public int Order { get; set; }
    public List<Lesson> Lessons { get; set; } = new();
}
