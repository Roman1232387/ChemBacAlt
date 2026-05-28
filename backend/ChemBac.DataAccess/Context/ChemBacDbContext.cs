using ChemBac.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ChemBac.DataAccess.Context;

public class ChemBacDbContext : DbContext
{
    public ChemBacDbContext()
    {
    }

    public ChemBacDbContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Lesson> Lessons { get; set; } = null!;
    public DbSet<LessonSection> LessonSections { get; set; } = null!;
    public DbSet<Test> Tests { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;
    public DbSet<QuestionOption> QuestionOptions { get; set; } = null!;
    public DbSet<Result> Results { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseNpgsql(DbSession.GetConnectionString());
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUsers(modelBuilder);
        ConfigureLessons(modelBuilder);
        ConfigureTests(modelBuilder);
        ConfigureResults(modelBuilder);
    }

    private static void ConfigureUsers(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
        });
    }

    private static void ConfigureLessons(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.HasMany(lesson => lesson.Sections)
                .WithOne(section => section.Lesson)
                .HasForeignKey(section => section.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(lesson => lesson.Tests)
                .WithOne(test => test.Lesson)
                .HasForeignKey(test => test.LessonId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }

    private static void ConfigureTests(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Test>(entity =>
        {
            entity.HasOne(test => test.CreatedBy)
                .WithMany(user => user.CreatedTests)
                .HasForeignKey(test => test.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasMany(test => test.Questions)
                .WithOne(question => question.Test)
                .HasForeignKey(question => question.TestId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasMany(question => question.Options)
                .WithOne(option => option.Question)
                .HasForeignKey(option => option.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    private static void ConfigureResults(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Result>(entity =>
        {
            entity.HasOne(result => result.User)
                .WithMany(user => user.Results)
                .HasForeignKey(result => result.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(result => result.Test)
                .WithMany(test => test.Results)
                .HasForeignKey(result => result.TestId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
