using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Test;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/test")]
[ApiController]
public class TestsController : ControllerBase
{
    internal ITestAction _testAction;

    public TestsController()
    {
        var bl = new BusinessLogic();
        _testAction = bl.TestAction();
    }

    [HttpGet("getAll")]
    public IActionResult GetAll()
    {
        try
        {
            var tests = _testAction.GetAllTestsAction();
            return Ok(tests);
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
            var test = _testAction.GetTestByIdAction(id);
            if (test == null) return NotFound(new { message = "Testul nu a fost gasit." });
            return Ok(test);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult Create([FromBody] TestDto data)
    {
        try
        {
            var response = _testAction.CreateTestAction(data);
            if (!response.IsSuccess) return BadRequest(response);

            var created = _testAction.GetAllTestsAction()
                .Where(t => t.Title == data.Title && t.CreatedById == data.CreatedById)
                .OrderByDescending(t => t.Id)
                .FirstOrDefault();

            return created == null ? Ok(response) : Ok(created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public IActionResult Update([FromBody] TestDto data)
    {
        try
        {
            var response = _testAction.UpdateTestAction(data);
            if (!response.IsSuccess) return BadRequest(response);

            var updated = _testAction.GetTestByIdAction(data.Id);
            return updated == null ? Ok(response) : Ok(updated);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(int id)
    {
        try
        {
            var response = _testAction.DeleteTestAction(id);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }
}
