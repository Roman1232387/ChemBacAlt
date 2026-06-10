using ChemBac.BusinessLayer;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Hosting;

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
    [EnableRateLimiting("auth")]
    public IActionResult Login([FromBody] UserLoginDto data)
    {
        try
        {
            var response = _authAction.LoginAction(data, _configuration);
            if (!response.IsSuccess) return Unauthorized(new { message = response.Message });

            if (!string.IsNullOrEmpty(response.Token))
            {
                var isProduction = HttpContext.RequestServices
                    .GetRequiredService<IWebHostEnvironment>().IsProduction();

                Response.Cookies.Append("auth_token", response.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = isProduction,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(60)
                });
            }

            return Ok(new
            {
                isSuccess = true,
                message = response.Message,
                user = response.User
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public IActionResult Register([FromBody] UserRegisterDto data)
    {
        try
        {
            var response = _authAction.RegisterAction(data, _configuration);
            if (!response.IsSuccess) return BadRequest(new { message = response.Message });

            if (!string.IsNullOrEmpty(response.Token))
            {
                var isProduction = HttpContext.RequestServices
                    .GetRequiredService<IWebHostEnvironment>().IsProduction();

                Response.Cookies.Append("auth_token", response.Token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = isProduction,
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTimeOffset.UtcNow.AddMinutes(60)
                });
            }

            return Ok(new
            {
                isSuccess = true,
                message = response.Message,
                user = response.User
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Eroare BD: {ex.Message}" });
        }
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetMe()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var email = User.FindFirst("email")?.Value;
        var name = User.FindFirst("name")?.Value;
        var role = User.FindFirst("role")?.Value;

        return Ok(new
        {
            id = userId,
            email,
            name,
            role
        });
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("auth_token");
        return Ok(new { message = "Deconectare reușită." });
    }
}
