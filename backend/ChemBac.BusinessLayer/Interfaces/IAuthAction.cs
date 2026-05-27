using System.Security.Claims;
using ChemBac.Domain.Models.User;
using Microsoft.Extensions.Configuration;

namespace ChemBac.BusinessLayer.Interfaces;

public interface IAuthAction
{
    AuthResponseDto LoginAction(UserLoginDto data, IConfiguration configuration);
    AuthResponseDto RegisterAction(UserRegisterDto data, IConfiguration configuration);
    ClaimsPrincipal? ValidateJwtTokenAction(string token, IConfiguration configuration);
}
