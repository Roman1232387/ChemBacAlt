using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.User;

namespace ChemBac.BusinessLayer.Core;

public class UserActions
{
    protected UserActions() { }

    protected List<UserResponseDto> GetAllUsersActionExecution()
    {
        var result = new List<UserResponseDto>();
        List<User> dbData;

        using (var db = new UserContext())
        {
            dbData = db.Users.ToList();
        }

        if (dbData.Count <= 0) return result;
        foreach (var item in dbData)
            result.Add(MapToDto(item));

        return result;
    }

    protected UserResponseDto? GetUserByIdActionExecution(int id)
    {
        using var db = new UserContext();
        var user = db.Users.FirstOrDefault(u => u.Id == id);
        return user == null ? null : MapToDto(user);
    }

    protected ActionResponce RegisterUserActionExecution(UserRegisterDto data)
    {
        using (var db = new UserContext())
        {
            var exists = db.Users.Any(u => u.Email == data.Email);
            if (exists)
                return new ActionResponce { IsSuccess = false, Message = "Email-ul este deja inregistrat." };

            var initials = string.Join("",
                data.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries)
                         .Select(n => n[0]))
                .ToUpper();

            var user = new User
            {
                Name           = data.Name,
                Email          = data.Email,
                PasswordHash   = BCrypt.Net.BCrypt.HashPassword(data.Password),
                Role           = "user",
                AvatarInitials = initials,
                CreatedAt      = DateTime.UtcNow
            };

            db.Users.Add(user);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Inregistrare reusita." };
    }

   protected LoginResponseDto LoginUserActionExecution(UserLoginDto data)
   {
       User? user;
       using (var db = new UserContext())
       {
           user = db.Users.FirstOrDefault(u => u.Email == data.Email);
       }

       if (user == null || !BCrypt.Net.BCrypt.Verify(data.Password, user.PasswordHash))
           return new LoginResponseDto { IsSuccess = false, Message = "Email sau parola incorecte." };

       return new LoginResponseDto
       {
           IsSuccess = true,
           Message = "Autentificare reusita.",
           User = MapToDto(user)
       };
   }

    protected ActionResponce UpdateUserActionExecution(UserResponseDto data)
    {
        User? existing;
        using (var db = new UserContext())
        {
            existing = db.Users.FirstOrDefault(u => u.Id == data.Id);
            if (existing == null)
                return new ActionResponce { IsSuccess = false, Message = "Utilizatorul nu a fost gasit." };

            existing.Name           = data.Name;
            existing.Email          = data.Email;
            existing.Role           = data.Role;
            existing.AvatarInitials = data.AvatarInitials;

            db.Users.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Utilizatorul a fost actualizat." };
    }

    protected ActionResponce DeleteUserActionExecution(int id)
    {
        using (var db = new UserContext())
        {
            var user = db.Users.FirstOrDefault(u => u.Id == id);
            if (user == null)
                return new ActionResponce { IsSuccess = false, Message = "Utilizatorul nu a fost gasit." };

            db.Users.Remove(user);
            db.SaveChanges();
        }

        return new ActionResponce { IsSuccess = true, Message = "Utilizatorul a fost sters." };
    }

    // ── Private helper ─────────────────────────────────────────────────────────

    private static UserResponseDto MapToDto(User u) => new UserResponseDto
    {
        Id             = u.Id,
        Name           = u.Name,
        Email          = u.Email,
        Role           = u.Role,
        AvatarInitials = u.AvatarInitials,
        CreatedAt      = u.CreatedAt
    };
}
