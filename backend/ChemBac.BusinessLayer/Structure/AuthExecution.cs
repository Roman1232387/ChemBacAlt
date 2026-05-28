using System.Security.Claims;
using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.User;
using Microsoft.Extensions.Configuration;

namespace ChemBac.BusinessLayer.Structure;

public class AuthExecution : AuthActions, IAuthAction
{
    public AuthResponseDto LoginAction(UserLoginDto data, IConfiguration configuration)
    {
        return LoginActionExecution(data, configuration);
    }

    public AuthResponseDto RegisterAction(UserRegisterDto data, IConfiguration configuration)
    {
        return RegisterActionExecution(data, configuration);
    }

    public ClaimsPrincipal? ValidateJwtTokenAction(string token, IConfiguration configuration)
    {
        return ValidateJwtTokenActionExecution(token, configuration);
    }
}
