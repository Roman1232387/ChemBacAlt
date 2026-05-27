using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Test;

namespace ChemBac.BusinessLayer.Core;

public class TestActions
{
    protected TestActions() { }

    protected List<TestDto> GetAllTestsActionExecution()
    {
        var result = new List<TestDto>();
        List<Test> dbData;

        using (var db = new TestContext())
        {
            dbData = db.Tests
                .Where(t => !t.IsDeleted)
                .ToList();

            foreach (var test in dbData)
            {
                db.Entry(test).Collection(t => t.Questions).Load();
                foreach (var q in test.Questions)
                    db.Entry(q).Collection(x => x.Options).Load();
            }
        }

        if (dbData.Count <= 0) return result;
        foreach (var item in dbData)
            result.Add(MapToDto(item));

        return result;
    }

    protected TestDto? GetTestByIdActionExecution(int id)
    {
        Test? dbData;

        using (var db = new TestContext())
        {
            dbData = db.Tests.FirstOrDefault(t => t.Id == id && !t.IsDeleted);
            if (dbData != null)
            {
                db.Entry(dbData).Collection(t => t.Questions).Load();
                foreach (var q in dbData.Questions)
                    db.Entry(q).Collection(x => x.Options).Load();
            }
        }

        return dbData == null ? null : MapToDto(dbData);
    }

    protected ActionResponce CreateTestActionExecution(TestDto data)
    {
        var validation = ValidateTestContent(data);
        if (!validation.IsSuccess) return validation;

        using (var db = new TestContext())
        {
            var test = new Test
            {
                Title        = data.Title,
                Description  = data.Description,
                Duration     = data.Duration,
                PassingScore = data.PassingScore,
                Status       = data.Status,
                LessonId     = data.LessonId,
                CreatedById  = data.CreatedById,
                CreatedAt    = DateTime.UtcNow,
                UpdatedAt    = DateTime.UtcNow,
                Questions    = data.Questions.Select(q => new Question
                {
                    Text        = q.Text,
                    Type        = q.Type,
                    Explanation = q.Explanation,
                    Points      = q.Points,
                    Options     = q.Options.Select(o => new QuestionOption
                    {
                        Text      = o.Text,
                        IsCorrect = o.IsCorrect
                    }).ToList()
                }).ToList()
            };

            db.Tests.Add(test);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Testul a fost creat cu succes." };
    }

    protected ActionResponce UpdateTestActionExecution(TestDto data)
    {
        var validation = ValidateTestContent(data);
        if (!validation.IsSuccess) return validation;

        var existing = GetTestEntityById(data.Id);
        if (existing == null)
            return new ActionResponce { IsSuccess = false, Message = "Testul nu a fost gasit." };

        using (var db = new TestContext())
        {
            db.Entry(existing).Collection(t => t.Questions).Load();
            foreach (var q in existing.Questions)
                db.Entry(q).Collection(x => x.Options).Load();

            existing.Title        = data.Title;
            existing.Description  = data.Description;
            existing.Duration     = data.Duration;
            existing.PassingScore = data.PassingScore;
            existing.Status       = data.Status;
            existing.LessonId     = data.LessonId;
            existing.UpdatedAt    = DateTime.UtcNow;

            foreach (var q in existing.Questions)
                db.QuestionOptions.RemoveRange(q.Options);
            db.Questions.RemoveRange(existing.Questions);

            existing.Questions = data.Questions.Select(q => new Question
            {
                Text        = q.Text,
                Type        = q.Type,
                Explanation = q.Explanation,
                Points      = q.Points,
                Options     = q.Options.Select(o => new QuestionOption
                {
                    Text      = o.Text,
                    IsCorrect = o.IsCorrect
                }).ToList()
            }).ToList();

            db.Tests.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Testul a fost actualizat cu succes." };
    }

    protected ActionResponce DeleteTestActionExecution(int id)
    {
        var existing = GetTestEntityById(id);
        if (existing == null)
            return new ActionResponce { IsSuccess = false, Message = "Testul nu a fost gasit." };

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        using (var db = new TestContext())
        {
            db.Tests.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Testul a fost sters." };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private Test? GetTestEntityById(int id)
    {
        using var db = new TestContext();
        return db.Tests.FirstOrDefault(t => t.Id == id && !t.IsDeleted);
    }

    private static ActionResponce ValidateTestContent(TestDto data)
    {
        if (string.IsNullOrWhiteSpace(data.Title) || data.Title.Trim().Length < 5)
            return new ActionResponce { IsSuccess = false, Message = "Titlul testului trebuie sa aiba minim 5 caractere." };

        if (string.IsNullOrWhiteSpace(data.Description) || data.Description.Trim().Length < 10)
            return new ActionResponce { IsSuccess = false, Message = "Descrierea testului trebuie sa aiba minim 10 caractere." };

        if (data.Duration < 5)
            return new ActionResponce { IsSuccess = false, Message = "Durata testului trebuie sa fie de minim 5 minute." };

        if (data.PassingScore < 10 || data.PassingScore > 100)
            return new ActionResponce { IsSuccess = false, Message = "Scorul de promovare trebuie sa fie intre 10 si 100." };

        if (data.Questions.Count == 0)
            return new ActionResponce { IsSuccess = false, Message = "Testul trebuie sa contina cel putin o intrebare." };

        foreach (var question in data.Questions)
        {
            if (string.IsNullOrWhiteSpace(question.Text))
                return new ActionResponce { IsSuccess = false, Message = "Fiecare intrebare trebuie sa aiba text." };

            if (question.Points < 1)
                return new ActionResponce { IsSuccess = false, Message = "Fiecare intrebare trebuie sa aiba minim 1 punct." };

            if (question.Options.Count < 2)
                return new ActionResponce { IsSuccess = false, Message = "Fiecare intrebare trebuie sa aiba minim doua optiuni." };

            if (question.Options.Any(o => string.IsNullOrWhiteSpace(o.Text)))
                return new ActionResponce { IsSuccess = false, Message = "Fiecare optiune trebuie sa aiba text." };

            if (!question.Options.Any(o => o.IsCorrect))
                return new ActionResponce { IsSuccess = false, Message = "Fiecare intrebare trebuie sa aiba cel putin un raspuns corect." };
        }

        return new ActionResponce { IsSuccess = true, Message = "Continut valid." };
    }

    private static TestDto MapToDto(Test t) => new TestDto
    {
        Id           = t.Id,
        Title        = t.Title,
        Description  = t.Description,
        Duration     = t.Duration,
        PassingScore = t.PassingScore,
        Status       = t.Status,
        LessonId     = t.LessonId,
        CreatedById  = t.CreatedById,
        CreatedAt    = t.CreatedAt,
        UpdatedAt    = t.UpdatedAt,
        Questions    = t.Questions.Select(q => new QuestionDto
        {
            Id          = q.Id,
            Text        = q.Text,
            Type        = q.Type,
            Explanation = q.Explanation,
            Points      = q.Points,
            Options     = q.Options.Select(o => new QuestionOptionDto
            {
                Id        = o.Id,
                Text      = o.Text,
                IsCorrect = o.IsCorrect
            }).ToList()
        }).ToList()
    };
}
