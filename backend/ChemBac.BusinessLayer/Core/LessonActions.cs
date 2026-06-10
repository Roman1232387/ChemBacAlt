using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Models.Responses;

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

    protected ActionResponse CreateLessonActionExecution(LessonDto data)
    {
        var contentValidation = ValidateLessonContent(data);
        if (!contentValidation.IsSuccess) return contentValidation;

        var validation = ValidateLessonTitle(data.Title);
        if (!validation.IsSuccess) return validation;

        using (var db = new LessonContext())
        {
            var lesson = new Lesson
            {
                Title       = data.Title,
                ChapterId   = data.ChapterId,
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
                    Order   = s.Order,
                    Type    = s.Type,
                    ImageUrl = s.ImageUrl,
                    TableJson = s.TableJson
                }).ToList()
            };

            db.Lessons.Add(lesson);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Lectia a fost creata cu succes." };
    }

    protected ActionResponse UpdateLessonActionExecution(LessonDto data)
    {
        var contentValidation = ValidateLessonContent(data);
        if (!contentValidation.IsSuccess) return contentValidation;

        var existing = GetLessonEntityById(data.Id);
        if (existing == null)
            return new ActionResponse { IsSuccess = false, Message = "Lectia nu a fost gasita." };

        using (var db = new LessonContext())
        {
            db.Entry(existing).Collection(l => l.Sections).Load();

            existing.Title       = data.Title;
            existing.ChapterId   = data.ChapterId;
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
                Order   = s.Order,
                Type    = s.Type,
                ImageUrl = s.ImageUrl,
                TableJson = s.TableJson
            }).ToList();

            db.Lessons.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Lectia a fost actualizata cu succes." };
    }

    protected ActionResponse DeleteLessonActionExecution(int id)
    {
        var existing = GetLessonEntityById(id);
        if (existing == null)
            return new ActionResponse { IsSuccess = false, Message = "Lectia nu a fost gasita." };

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        using (var db = new LessonContext())
        {
            db.Lessons.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Lectia a fost stearsa." };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private Lesson? GetLessonEntityById(int id)
    {
        using var db = new LessonContext();
        return db.Lessons.FirstOrDefault(l => l.Id == id && !l.IsDeleted);
    }

    private ActionResponse ValidateLessonTitle(string title)
    {
        using var db = new LessonContext();
        var exists = db.Lessons
            .Any(l => l.Title.ToLower() == title.ToLower() && !l.IsDeleted);

        if (exists)
            return new ActionResponse { IsSuccess = false, Message = "O lectie cu acest titlu exista deja." };

        return new ActionResponse { IsSuccess = true, Message = "Titlu valid." };
    }

    private static ActionResponse ValidateLessonContent(LessonDto data)
    {
        if (string.IsNullOrWhiteSpace(data.Title) || data.Title.Trim().Length < 5)
            return new ActionResponse { IsSuccess = false, Message = "Titlul lectiei trebuie sa aiba minim 5 caractere." };

        if (string.IsNullOrWhiteSpace(data.Description) || data.Description.Trim().Length < 10)
            return new ActionResponse { IsSuccess = false, Message = "Descrierea lectiei trebuie sa aiba minim 10 caractere." };

        if (data.Duration < 5)
            return new ActionResponse { IsSuccess = false, Message = "Durata lectiei trebuie sa fie de minim 5 minute." };

        if (data.Sections.Count == 0)
            return new ActionResponse { IsSuccess = false, Message = "Lectia trebuie sa contina cel putin o sectiune." };

        if (data.Sections.Any(s => string.IsNullOrWhiteSpace(s.Title) || string.IsNullOrWhiteSpace(s.Content)))
            return new ActionResponse { IsSuccess = false, Message = "Fiecare sectiune trebuie sa aiba titlu si continut." };

        return new ActionResponse { IsSuccess = true, Message = "Continut valid." };
    }

    private static LessonDto MapToDto(Lesson l) => new LessonDto
    {
        Id          = l.Id,
        ChapterId   = l.ChapterId,
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
            Order   = s.Order,
            Type    = s.Type,
            ImageUrl = s.ImageUrl,
            TableJson = s.TableJson
        }).ToList()
    };
}
