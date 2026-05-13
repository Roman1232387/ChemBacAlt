using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Result;

namespace ChemBac.BusinessLayer.Core;

public class ResultActions
{
    protected ResultActions() { }

    protected List<ResultDto> GetResultsByUserActionExecution(int userId)
    {
        using var db = new ResultContext();
        return db.Results
            .Where(r => r.UserId == userId)
            .ToList()
            .Select(MapToDto)
            .ToList();
    }

    protected ResultDto? GetResultByIdActionExecution(int id)
    {
        using var db = new ResultContext();
        var result = db.Results.FirstOrDefault(r => r.Id == id);
        return result == null ? null : MapToDto(result);
    }

    protected ActionResponce SubmitResultActionExecution(ResultDto data)
    {
        using var db = new ResultContext();
        var result = new Result
        {
            UserId = data.UserId,
            TestId = data.TestId,
            Score = data.Score,
            MaxScore = data.MaxScore,
            Percentage = data.Percentage,
            Passed = data.Passed,
            AnswersJson = data.AnswersJson,
            QuestionResultsJson = data.QuestionResultsJson,
            StartedAt = data.StartedAt,
            CompletedAt = data.CompletedAt,
            Duration = data.Duration,
        };
        db.Results.Add(result);
        db.SaveChanges();
        return new ActionResponce { IsSuccess = true, Message = "Rezultatul a fost salvat." };
    }

    private static ResultDto MapToDto(Result r) => new ResultDto
    {
        Id = r.Id,
        UserId = r.UserId,
        TestId = r.TestId,
        Score = r.Score,
        MaxScore = r.MaxScore,
        Percentage = r.Percentage,
        Passed = r.Passed,
        AnswersJson = r.AnswersJson,
        QuestionResultsJson = r.QuestionResultsJson,
        StartedAt = r.StartedAt,
        CompletedAt = r.CompletedAt,
        Duration = r.Duration,
    };
}