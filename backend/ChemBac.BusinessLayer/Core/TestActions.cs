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
