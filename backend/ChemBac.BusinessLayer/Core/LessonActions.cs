using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Models.Responces;

namespace ChemBac.BusinessLayer.Core;

public class LessonActions
{
    protected LessonActions() { }

    protected List<LessonDto> GetAllLessonsActionExecution()
    {
        var result = new List<LessonDto>();
        List<Lesson> dbData;

        using (var db = new LessonContext())
        {
            dbData = db.Lessons
                .Where(l => !l.IsDeleted)
                .ToList();

            foreach (var lesson in dbData)
            {
                db.Entry(lesson)
                  .Collection(l => l.Sections)
                  .Load();
            }
        }

        if (dbData.Count <= 0) return result;

        foreach (var item in dbData)
        {
            result.Add(MapToDto(item));
        }

        return result;
    }

    protected LessonDto? GetLessonByIdActionExecution(int id)
    {
        Lesson? dbData;

        using (var db = new LessonContext())
        {
            dbData = db.Lessons.FirstOrDefault(l => l.Id == id && !l.IsDeleted);
            if (dbData != null)
            {
                db.Entry(dbData).Collection(l => l.Sections).Load();
            }
        }

        return dbData == null ? null : MapToDto(dbData);
    }

    protected ActionResponce CreateLessonActionExecution(LessonDto data)
    {
        var validation = ValidateLessonTitle(data.Title);
        if (!validation.IsSuccess) return validation;

        using (var db = new LessonContext())
        {
            var lesson = new Lesson
            {
                Title       = data.Title,
                Category    = data.Category,
                Difficulty  = data.Difficulty,
                Description = data.Description,
                Duration    = data.Duration,
                CreatedAt   = DateTime.UtcNow,
                UpdatedAt   = DateTime.UtcNow,
                Sections    = data.Sections.Select(s => new LessonSection
                {
                    Title   = s.Title,
                    Content = s.Content,
                    Formula = s.Formula,
                    Order   = s.Order
                }).ToList()
            };

            db.Lessons.Add(lesson);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Lectia a fost creata cu succes." };
    }

    protected ActionResponce UpdateLessonActionExecution(LessonDto data)
    {
        var existing = GetLessonEntityById(data.Id);
        if (existing == null)
            return new ActionResponce { IsSuccess = false, Message = "Lectia nu a fost gasita." };

        using (var db = new LessonContext())
        {
            db.Entry(existing).Collection(l => l.Sections).Load();

            existing.Title       = data.Title;
            existing.Category    = data.Category;
            existing.Difficulty  = data.Difficulty;
            existing.Description = data.Description;
            existing.Duration    = data.Duration;
            existing.UpdatedAt   = DateTime.UtcNow;

            db.LessonSections.RemoveRange(existing.Sections);

            existing.Sections = data.Sections.Select(s => new LessonSection
            {
                Title   = s.Title,
                Content = s.Content,
                Formula = s.Formula,
                Order   = s.Order
            }).ToList();

            db.Lessons.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Lectia a fost actualizata cu succes." };
    }

    protected ActionResponce DeleteLessonActionExecution(int id)
    {
        var existing = GetLessonEntityById(id);
        if (existing == null)
            return new ActionResponce { IsSuccess = false, Message = "Lectia nu a fost gasita." };

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        using (var db = new LessonContext())
        {
            db.Lessons.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Lectia a fost stearsa." };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private Lesson? GetLessonEntityById(int id)
    {
        using var db = new LessonContext();
        return db.Lessons.FirstOrDefault(l => l.Id == id && !l.IsDeleted);
    }

    private ActionResponce ValidateLessonTitle(string title)
    {
        using var db = new LessonContext();
        var exists = db.Lessons
            .Any(l => l.Title.ToLower() == title.ToLower() && !l.IsDeleted);

        if (exists)
            return new ActionResponce { IsSuccess = false, Message = "O lectie cu acest titlu exista deja." };

        return new ActionResponce { IsSuccess = true, Message = "Titlu valid." };
    }

    private static LessonDto MapToDto(Lesson l) => new LessonDto
    {
        Id          = l.Id,
        Title       = l.Title,
        Category    = l.Category,
        Difficulty  = l.Difficulty,
        Description = l.Description,
        Duration    = l.Duration,
        CreatedAt   = l.CreatedAt,
        UpdatedAt   = l.UpdatedAt,
        Sections    = l.Sections.Select(s => new LessonSectionDto
        {
            Id      = s.Id,
            Title   = s.Title,
            Content = s.Content,
            Formula = s.Formula,
            Order   = s.Order
        }).ToList()
    };
}
