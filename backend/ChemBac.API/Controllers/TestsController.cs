using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Test;
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
        var tests = _testAction.GetAllTestsAction();
        return Ok(tests);
    }

    [HttpGet]
    public IActionResult GetById(int id)
    {
        var test = _testAction.GetTestByIdAction(id);
        if (test == null) return NotFound(new { message = "Testul nu a fost gasit." });
        return Ok(test);
    }

    [HttpPost]
    public IActionResult Create([FromBody] TestDto data)
    {
        var response = _testAction.CreateTestAction(data);
        return Ok(response);
    }

    [HttpPut]
    public IActionResult Update([FromBody] TestDto data)
    {
        var response = _testAction.UpdateTestAction(data);
        return Ok(response);
    }

    [HttpDelete]
    public IActionResult Delete(int id)
    {
        var response = _testAction.DeleteTestAction(id);
        return Ok(response);
    }
}
