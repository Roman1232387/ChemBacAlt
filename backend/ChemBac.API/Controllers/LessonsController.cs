using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Lesson;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonsController : ControllerBase
{
    internal ILessonAction _lessonAction;

    public LessonsController()
    {
        var bl = new BusinessLogic();
        _lessonAction = bl.LessonAction();
    }

    [HttpGet("getAll")]
    public IActionResult GetAll()
    {
        var lessons = _lessonAction.GetAllLessonsAction();
        return Ok(lessons);
    }

    [HttpGet]
    public IActionResult GetById(int id)
    {
        var lesson = _lessonAction.GetLessonByIdAction(id);
        if (lesson == null) return NotFound(new { message = "Lectia nu a fost gasita." });
        return Ok(lesson);
    }

    [HttpPost]
    public IActionResult Create([FromBody] LessonDto data)
    {
        var response = _lessonAction.CreateLessonAction(data);
        return Ok(response);
    }

    [HttpPut]
    public IActionResult Update([FromBody] LessonDto data)
    {
        var response = _lessonAction.UpdateLessonAction(data);
        return Ok(response);
    }

    [HttpDelete]
    public IActionResult Delete(int id)
    {
        var response = _lessonAction.DeleteLessonAction(id);
        return Ok(response);
    }
}
