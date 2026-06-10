using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.DataAccess.Context;
using ChemBac.Domain.Models.Result;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace ChemBac.API.Controllers;

[Route("api/result")]
[ApiController]
[Authorize]
public class ResultsController : ControllerBase
{
    internal IResultAction _resultAction;

    public ResultsController()
    {
        var bl = new BusinessLogic();
        _resultAction = bl.ResultAction();
    }

    [HttpGet("getByUser")]
    public IActionResult GetByUser(int userId)
    {
        try
        {
            var results = _resultAction.GetResultsByUserAction(userId);
            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAll()
    {
        try
        {
            var results = _resultAction.GetAllResultsAction();
            return Ok(results);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpGet]
    public IActionResult GetById(int id)
    {
        try
        {
            var result = _resultAction.GetResultByIdAction(id);
            if (result == null) return NotFound(new { message = $"Rezultatul cu id-ul {id} nu a fost găsit." });
            return Ok(result);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost]
    public IActionResult Submit([FromBody] ResultDto data)
    {
        try
        {
            var response = _resultAction.SubmitResultAction(data);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost("verify-step")]
    [EnableRateLimiting("verify")]
    public IActionResult VerifyStep([FromBody] VerifyStepRequest data)
    {
        try
        {
            using var db = new TestContext();
            var step = db.QuestionSteps
                .AsNoTracking()
                .FirstOrDefault(s => s.Id == data.StepId && s.QuestionId == data.QuestionId);

            if (step == null)
                return NotFound(new { message = "Etapa nu a fost găsită." });

            var isCorrect = step.StepType == "numeric"
                ? IsNumericAnswerCorrect(data.UserAnswer, step.CorrectAnswer, step.Tolerance)
                : string.Equals(data.UserAnswer.Trim(), step.CorrectAnswer.Trim(), StringComparison.OrdinalIgnoreCase);

            return Ok(new
            {
                isCorrect,
                pointsEarned = isCorrect ? step.Points : 0
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    private static bool IsNumericAnswerCorrect(string userAnswer, string correctAnswer, double tolerance)
    {
        var styles = NumberStyles.Float;
        var culture = CultureInfo.InvariantCulture;
        if (!double.TryParse(userAnswer.Replace(',', '.'), styles, culture, out var userValue)) return false;
        if (!double.TryParse(correctAnswer.Replace(',', '.'), styles, culture, out var correctValue)) return false;

        return Math.Abs(userValue - correctValue) <= tolerance;
    }
}

public class VerifyStepRequest
{
    public int QuestionId { get; set; }
    public int StepId { get; set; }
    public string UserAnswer { get; set; } = string.Empty;
}
