using ChemBac.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class LessonContext : DbContext
{
    public DbSet<Chapter> Chapters { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonSection> LessonSections { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Chapter>(e =>
        {
            e.HasMany(c => c.Lessons)
             .WithOne(l => l.Chapter)
             .HasForeignKey(l => l.ChapterId)
             .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<LessonSection>(e =>
        {
            e.HasOne(s => s.Lesson)
             .WithMany(l => l.Sections)
             .HasForeignKey(s => s.LessonId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
