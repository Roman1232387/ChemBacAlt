using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Responses;
using ChemBac.Domain.Models.Test;
using Microsoft.EntityFrameworkCore;

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
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Steps)
                .Where(t => !t.IsDeleted)
                .ToList();
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
            dbData = db.Tests
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Steps)
                .FirstOrDefault(t => t.Id == id && !t.IsDeleted);
        }

        return dbData == null ? null : MapToDto(dbData);
    }

    protected ActionResponse CreateTestActionExecution(TestDto data)
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
                    Steps       = q.Steps.Select(s => new QuestionStep
                    {
                        Order = s.Order,
                        Prompt = s.Prompt,
                        CorrectAnswer = s.CorrectAnswer,
                        StepType = s.StepType,
                        Tolerance = s.Tolerance,
                        Points = s.Points,
                        Unit = s.Unit
                    }).ToList(),
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

        return new ActionResponse { IsSuccess = true, Message = "Testul a fost creat cu succes." };
    }

    protected ActionResponse UpdateTestActionExecution(TestDto data)
    {
        var validation = ValidateTestContent(data);
        if (!validation.IsSuccess) return validation;

        using (var db = new TestContext())
        {
            var existing = db.Tests
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Options)
                .Include(t => t.Questions)
                    .ThenInclude(q => q.Steps)
                .FirstOrDefault(t => t.Id == data.Id && !t.IsDeleted);

            if (existing == null)
                return new ActionResponse { IsSuccess = false, Message = "Testul nu a fost găsit." };

            existing.Title        = data.Title;
            existing.Description  = data.Description;
            existing.Duration     = data.Duration;
            existing.PassingScore = data.PassingScore;
            existing.Status       = data.Status;
            existing.LessonId     = data.LessonId;
            existing.UpdatedAt    = DateTime.UtcNow;

            foreach (var q in existing.Questions)
            {
                db.QuestionOptions.RemoveRange(q.Options);
                db.QuestionSteps.RemoveRange(q.Steps);
            }
            db.Questions.RemoveRange(existing.Questions);

            existing.Questions = data.Questions.Select(q => new Question
            {
                Text        = q.Text,
                Type        = q.Type,
                Explanation = q.Explanation,
                Points      = q.Points,
                Steps       = q.Steps.Select(s => new QuestionStep
                {
                    Order = s.Order,
                    Prompt = s.Prompt,
                    CorrectAnswer = s.CorrectAnswer,
                    StepType = s.StepType,
                    Tolerance = s.Tolerance,
                    Points = s.Points,
                    Unit = s.Unit
                }).ToList(),
                Options     = q.Options.Select(o => new QuestionOption
                {
                    Text      = o.Text,
                    IsCorrect = o.IsCorrect
                }).ToList()
            }).ToList();

            db.Tests.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Testul a fost actualizat cu succes." };
    }

    protected ActionResponse DeleteTestActionExecution(int id)
    {
        var existing = GetTestEntityById(id);
        if (existing == null)
            return new ActionResponse { IsSuccess = false, Message = "Testul nu a fost găsit." };

        existing.IsDeleted = true;
        existing.UpdatedAt = DateTime.UtcNow;

        using (var db = new TestContext())
        {
            db.Tests.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Testul a fost șters." };
    }

    // ── Private helpers ────────────────────────────────────────────────────────

    private Test? GetTestEntityById(int id)
    {
        using var db = new TestContext();
        return db.Tests.FirstOrDefault(t => t.Id == id && !t.IsDeleted);
    }

    private static ActionResponse ValidateTestContent(TestDto data)
    {
        if (string.IsNullOrWhiteSpace(data.Title) || data.Title.Trim().Length < 5)
            return new ActionResponse { IsSuccess = false, Message = "Titlul testului trebuie să aibă minim 5 caractere." };

        if (string.IsNullOrWhiteSpace(data.Description) || data.Description.Trim().Length < 10)
            return new ActionResponse { IsSuccess = false, Message = "Descrierea testului trebuie să aibă minim 10 caractere." };

        if (data.Duration < 5)
            return new ActionResponse { IsSuccess = false, Message = "Durata testului trebuie să fie de minim 5 minute." };

        if (data.PassingScore < 10 || data.PassingScore > 100)
            return new ActionResponse { IsSuccess = false, Message = "Scorul de promovare trebuie să fie între 10 și 100." };

        if (data.Questions.Count == 0)
            return new ActionResponse { IsSuccess = false, Message = "Testul trebuie să conțină cel puțin o întrebare." };

        foreach (var question in data.Questions)
        {
            if (string.IsNullOrWhiteSpace(question.Text))
                return new ActionResponse { IsSuccess = false, Message = "Fiecare întrebare trebuie să aibă text." };

            if (question.Points < 1)
                return new ActionResponse { IsSuccess = false, Message = "Fiecare întrebare trebuie să aibă minim 1 punct." };

            if (question.Type == "stepped")
            {
                if (question.Steps.Count < 2)
                    return new ActionResponse { IsSuccess = false, Message = "O întrebare pe etape trebuie să aibă minim două etape." };

                if (question.Steps.Any(s => string.IsNullOrWhiteSpace(s.Prompt) || string.IsNullOrWhiteSpace(s.CorrectAnswer)))
                    return new ActionResponse { IsSuccess = false, Message = "Fiecare etapă trebuie să aibă enunț și răspuns corect." };

                continue;
            }

            if (question.Options.Count < 2)
                return new ActionResponse { IsSuccess = false, Message = "Fiecare întrebare trebuie să aibă minim două opțiuni." };

            if (question.Options.Any(o => string.IsNullOrWhiteSpace(o.Text)))
                return new ActionResponse { IsSuccess = false, Message = "Fiecare opțiune trebuie să aibă text." };

            if (!question.Options.Any(o => o.IsCorrect))
                return new ActionResponse { IsSuccess = false, Message = "Fiecare întrebare trebuie să aibă cel puțin un răspuns corect." };
        }

        return new ActionResponse { IsSuccess = true, Message = "Conținut valid." };
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
            Steps       = q.Steps.OrderBy(s => s.Order).Select(s => new QuestionStepDto
            {
                Id = s.Id,
                QuestionId = s.QuestionId,
                Order = s.Order,
                Prompt = s.Prompt,
                CorrectAnswer = s.CorrectAnswer,
                StepType = s.StepType,
                Tolerance = s.Tolerance,
                Points = s.Points,
                Unit = s.Unit
            }).ToList(),
            Options     = q.Options.Select(o => new QuestionOptionDto
            {
                Id        = o.Id,
                Text      = o.Text,
                IsCorrect = o.IsCorrect
            }).ToList()
        }).ToList()
    };
}
