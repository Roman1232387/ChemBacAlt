using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Lesson;
using Microsoft.AspNetCore.Authorization;
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
        try
        {
            var lessons = _lessonAction.GetAllLessonsAction();
            return Ok(lessons);
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
            var lesson = _lessonAction.GetLessonByIdAction(id);
            if (lesson == null) return NotFound(new { message = "Lectia nu a fost gasita." });
            return Ok(lesson);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public IActionResult Create([FromBody] LessonDto data)
    {
        try
        {
            var response = _lessonAction.CreateLessonAction(data);
            if (!response.IsSuccess) return BadRequest(response);

            var created = _lessonAction.GetAllLessonsAction()
                .Where(l => l.Title == data.Title)
                .OrderByDescending(l => l.Id)
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
    public IActionResult Update([FromBody] LessonDto data)
    {
        try
        {
            var response = _lessonAction.UpdateLessonAction(data);
            if (!response.IsSuccess) return BadRequest(response);

            var updated = _lessonAction.GetLessonByIdAction(data.Id);
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
            var response = _lessonAction.DeleteLessonAction(id);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }
}
