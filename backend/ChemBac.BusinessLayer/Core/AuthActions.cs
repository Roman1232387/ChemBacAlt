using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using ChemBac.BusinessLayer.Services;
using ChemBac.Domain.Models.User;
using ChemBac.Domain.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace ChemBac.BusinessLayer.Core;

public class AuthActions
{
    protected AuthActions() { }

    protected AuthResponseDto LoginActionExecution(UserLoginDto data, IConfiguration configuration)
    {
        var userAction = new UserService();
        var loginResponse = userAction.LoginUserAction(data);

        if (!loginResponse.IsSuccess || loginResponse.User == null)
        {
            return new AuthResponseDto
            {
                IsSuccess = false,
                Message = loginResponse.Message
            };
        }

        return CreateAuthResponse(loginResponse.User, loginResponse.Message, configuration);
    }

    protected AuthResponseDto RegisterActionExecution(UserRegisterDto data, IConfiguration configuration)
    {
        var userAction = new UserService();
        var registerResponse = userAction.RegisterUserAction(data);

        if (!registerResponse.IsSuccess)
        {
            return new AuthResponseDto
            {
                IsSuccess = false,
                Message = registerResponse.Message ?? "Inregistrare esuata."
            };
        }

        return LoginActionExecution(new UserLoginDto
        {
            Email = data.Email,
            Password = data.Password
        }, configuration);
    }

    protected ClaimsPrincipal? ValidateJwtTokenActionExecution(string token, IConfiguration configuration)
    {
        var handler = new JwtSecurityTokenHandler();
        try
        {
            return handler.ValidateToken(token, BuildValidationParameters(configuration), out _);
        }
        catch
        {
            return null;
        }
    }

    private static AuthResponseDto CreateAuthResponse(UserResponseDto user, string message, IConfiguration configuration)
    {
        var expiresAt = GetTokenExpiration(configuration);

        return new AuthResponseDto
        {
            IsSuccess = true,
            Message = message,
            Token = GenerateToken(user, configuration, expiresAt),
            ExpiresAt = expiresAt,
            User = user
        };
    }

    private static string GenerateToken(UserResponseDto user, IConfiguration configuration, DateTime expiresAt)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var role = NormalizeRole(user.Role);

        var claims = new[]
        {
            new Claim("userId", user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim("role", role),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(GetSigningKey(configuration), SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static TokenValidationParameters BuildValidationParameters(IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        return new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = GetSigningKey(configuration),
            ClockSkew = TimeSpan.Zero
        };
    }

    private static SymmetricSecurityKey GetSigningKey(IConfiguration configuration)
    {
        var secret = configuration["Jwt:Secret"] ?? throw new InvalidOperationException("Jwt:Secret is not configured.");
        return new SymmetricSecurityKey(SHA256.HashData(Encoding.UTF8.GetBytes(secret)));
    }

    private static DateTime GetTokenExpiration(IConfiguration configuration)
    {
        var expiresInMinutes = int.TryParse(configuration["Jwt:ExpiresInMinutes"], out var minutes)
            ? minutes
            : 60;

        return DateTime.UtcNow.AddMinutes(expiresInMinutes);
    }

    private static string NormalizeRole(string role)
    {
        return string.Equals(role, AppRoles.Admin, StringComparison.OrdinalIgnoreCase)
            ? AppRoles.Admin
            : AppRoles.User;
    }
}
