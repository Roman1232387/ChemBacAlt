using ChemBac.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class LessonContext : DbContext
{
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonSection> LessonSections { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<LessonSection>(e =>
        {
            e.HasOne(s => s.Lesson)
             .WithMany(l => l.Sections)
             .HasForeignKey(s => s.LessonId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}