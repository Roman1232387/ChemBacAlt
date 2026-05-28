using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Result;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/result")]
[ApiController]
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

    [HttpGet]
    public IActionResult GetById(int id)
    {
        try
        {
            var result = _resultAction.GetResultByIdAction(id);
            if (result == null) return NotFound(new { message = "Rezultatul nu a fost gasit." });
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
}
