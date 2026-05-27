using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.User;
using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IAuthAction _authAction;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
        var bl = new BusinessLogic();
        _authAction = bl.AuthAction();
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] UserLoginDto data)
    {
        try
        {
            var response = _authAction.LoginAction(data, _configuration);
            if (!response.IsSuccess) return Unauthorized(new { message = response.Message });
            return Ok(response);
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
            var response = _authAction.RegisterAction(data, _configuration);
            if (!response.IsSuccess) return BadRequest(new { message = response.Message });
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }
}
