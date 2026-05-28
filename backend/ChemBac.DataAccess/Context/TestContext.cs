using ChemBac.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class TestContext : DbContext
{
    public DbSet<Test> Tests { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuestionOption> QuestionOptions { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseNpgsql(DbSession.ConnectionString);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Question>(e =>
        {
            e.HasOne(q => q.Test)
             .WithMany(t => t.Questions)
             .HasForeignKey(q => q.TestId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<QuestionOption>(e =>
        {
            e.HasOne(o => o.Question)
             .WithMany(q => q.Options)
             .HasForeignKey(o => o.QuestionId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}