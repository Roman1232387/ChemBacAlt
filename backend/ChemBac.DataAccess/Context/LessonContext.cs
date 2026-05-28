using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class LessonContext : ChemBacDbContext
{
    public LessonContext()
    {
    }

    public LessonContext(DbContextOptions<LessonContext> options) : base(options)
    {
    }
}
