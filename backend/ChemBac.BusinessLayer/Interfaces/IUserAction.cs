using ChemBac.Domain.Models.Responses;
using ChemBac.Domain.Models.User;

namespace ChemBac.BusinessLayer.Interfaces;

public interface IUserAction
{
    List<UserResponseDto> GetAllUsersAction();
    UserResponseDto? GetUserByIdAction(int id);
    ActionResponse RegisterUserAction(UserRegisterDto data);
    LoginResponseDto LoginUserAction(UserLoginDto data);
    ActionResponse UpdateUserAction(UserResponseDto data);
    ActionResponse DeleteUserAction(int id);
}
