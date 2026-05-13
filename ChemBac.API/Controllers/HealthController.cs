using Microsoft.AspNetCore.Mvc;

namespace ChemBac.API.Controllers;

[Route("api/health")]
[ApiController]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status    = "healthy",
            timestamp = DateTime.UtcNow,
            service   = "ChemBac API"
        });
    }
}
