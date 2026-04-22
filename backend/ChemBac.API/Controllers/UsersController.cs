using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.User;
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
    public IActionResult GetAll()
    {
        var users = _userAction.GetAllUsersAction();
        return Ok(users);
    }

    [HttpGet]
    public IActionResult GetById(int id)
    {
        var user = _userAction.GetUserByIdAction(id);
        if (user == null) return NotFound(new { message = "Utilizatorul nu a fost gasit." });
        return Ok(user);
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] UserRegisterDto data)
    {
        var response = _userAction.RegisterUserAction(data);
        return Ok(response);
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto data)
    {
        var response = _userAction.LoginUserAction(data);
        return Ok(response);
    }

    [HttpPut]
    public IActionResult Update([FromBody] UserResponseDto data)
    {
        var response = _userAction.UpdateUserAction(data);
        return Ok(response);
    }

    [HttpDelete]
    public IActionResult Delete(int id)
    {
        var response = _userAction.DeleteUserAction(id);
        return Ok(response);
    }
}
