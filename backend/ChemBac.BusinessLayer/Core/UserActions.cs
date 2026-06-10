using ChemBac.DataAccess.Context;
using ChemBac.Domain.Entities;
using ChemBac.Domain.Models.Responses;
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

    protected ActionResponse RegisterUserActionExecution(UserRegisterDto data)
    {
        // Validare Nume
        if (string.IsNullOrWhiteSpace(data.Name) || data.Name.Length < 2)
            return new ActionResponse { IsSuccess = false, Message = "Numele trebuie să aibă minim 2 caractere." };

        // Validare Email
        try
        {
            var addr = new System.Net.Mail.MailAddress(data.Email);
            if (addr.Address != data.Email) throw new Exception();
        }
        catch
        {
            return new ActionResponse { IsSuccess = false, Message = "Formatul email-ului este invalid." };
        }

        // Validare Parolă
        if (string.IsNullOrEmpty(data.Password) || data.Password.Length < 8 || 
            !data.Password.Any(char.IsUpper) || !data.Password.Any(char.IsDigit))
        {
            return new ActionResponse { IsSuccess = false, Message = "Parola trebuie să aibă minim 8 caractere, o literă mare și o cifră." };
        }

        using (var db = new UserContext())
        {
            var exists = db.Users.Any(u => u.Email == data.Email);
            if (exists)
                return new ActionResponse { IsSuccess = false, Message = "Email-ul este deja inregistrat." };

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

        return new ActionResponse { IsSuccess = true, Message = "Inregistrare reusita." };
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

    protected ActionResponse UpdateUserActionExecution(UserResponseDto data)
    {
        User? existing;
        using (var db = new UserContext())
        {
            existing = db.Users.FirstOrDefault(u => u.Id == data.Id);
            if (existing == null)
                return new ActionResponse { IsSuccess = false, Message = "Utilizatorul nu a fost gasit." };

            existing.Name           = data.Name;
            existing.Email          = data.Email;
            existing.Role           = data.Role;
            existing.AvatarInitials = data.AvatarInitials;

            db.Users.Update(existing);
            db.SaveChanges();
        }

        return new ActionResponse { IsSuccess = true, Message = "Utilizatorul a fost actualizat." };
    }

    protected ActionResponse DeleteUserActionExecution(int id)
    {
        try
        {
            // 1. Șterge rezultatele asociate din ResultContext
            using (var resDb = new ResultContext())
            {
                var userResults = resDb.Results.Where(r => r.UserId == id).ToList();
                if (userResults.Any())
                {
                    resDb.Results.RemoveRange(userResults);
                    resDb.SaveChanges();
                }
            }

            // 2. Șterge utilizatorul din UserContext
            using (var db = new UserContext())
            {
                var user = db.Users.FirstOrDefault(u => u.Id == id);
                if (user == null)
                    return new ActionResponse { IsSuccess = false, Message = "Utilizatorul nu a fost găsit." };

                db.Users.Remove(user);
                db.SaveChanges();
            }

            return new ActionResponse { IsSuccess = true, Message = "Contul și toate datele asociate au fost șterse." };
        }
        catch (Exception)
        {
            return new ActionResponse { IsSuccess = false, Message = "Eroare la ștergerea datelor asociate." };
        }
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
