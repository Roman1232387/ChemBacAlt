using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/user")]
[ApiController]
public class UsersController : ControllerBase
{
    internal IUserAction _userAction;

    public UsersController()
    {
        var bl = new BusinessLogic();
        _userAction = bl.UserAction();
    }

    [HttpGet("getAll")]
    [Authorize]
    public IActionResult GetAll()
    {
        try
        {
            var users = _userAction.GetAllUsersAction();
            return Ok(users);
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
            var user = _userAction.GetUserByIdAction(id);
            if (user == null) return NotFound(new { message = "Utilizatorul nu a fost gasit." });
            return Ok(user);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserRegisterDto data)
    {
        try
        {
            var response = _userAction.RegisterUserAction(data);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto data)
    {
        try
        {
            var response = _userAction.LoginUserAction(data);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPut]
    public IActionResult Update([FromBody] UserResponseDto data)
    {
        try
        {
            var response = _userAction.UpdateUserAction(data);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpDelete]
    [Authorize]
    public IActionResult Delete(int id)
    {
        try
        {
            var response = _userAction.DeleteUserAction(id);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }
}
