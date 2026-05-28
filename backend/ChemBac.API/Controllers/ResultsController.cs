using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Result;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/result")]
[ApiController]
public class ResultsController : ControllerBase
{
    private readonly IResultAction _resultAction;

    public ResultsController(BusinessLogic businessLogic)
    {
        _resultAction = businessLogic.ResultAction();
    }

    [HttpGet("getByUser")]
    [Authorize]
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
    [Authorize]
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
    [Authorize]
    public IActionResult Submit([FromBody] ResultDto data)
    {
        try
        {
            var response = _resultAction.SubmitResultAction(data);
            if (!response.IsSuccess) return BadRequest(response);
            return StatusCode(StatusCodes.Status201Created, response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }
}
