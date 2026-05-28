using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/lesson")]
[ApiController]
public class LessonsController : ControllerBase
{
    private readonly ILessonAction _lessonAction;

    public LessonsController(BusinessLogic businessLogic)
    {
        _lessonAction = businessLogic.LessonAction();
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
    [Authorize(Roles = AppRoles.Admin)]
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

            return created == null
                ? StatusCode(StatusCodes.Status201Created, response)
                : CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPut]
    [Authorize(Roles = AppRoles.Admin)]
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
    [Authorize(Roles = AppRoles.Admin)]
    public IActionResult Delete(int id)
    {
        try
        {
            var response = _lessonAction.DeleteLessonAction(id);
            if (!response.IsSuccess) return NotFound(response);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }
}
