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
        var results = _resultAction.GetResultsByUserAction(userId);
        return Ok(results);
    }

    [HttpGet]
    public IActionResult GetById(int id)
    {
        var result = _resultAction.GetResultByIdAction(id);
        if (result == null) return NotFound(new { message = "Rezultatul nu a fost gasit." });
        return Ok(result);
    }

    [HttpPost]
    public IActionResult Submit([FromBody] ResultDto data)
    {
        var response = _resultAction.SubmitResultAction(data);
        return Ok(response);
    }
}