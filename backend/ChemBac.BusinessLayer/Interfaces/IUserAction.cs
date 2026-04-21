using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.User;

namespace ChemBac.BusinessLayer.Interfaces;

public interface IUserAction
{
    List<UserResponseDto> GetAllUsersAction();
    UserResponseDto? GetUserByIdAction(int id);
    ActionResponce RegisterUserAction(UserRegisterDto data);
    ActionResponce LoginUserAction(UserLoginDto data);
    ActionResponce UpdateUserAction(UserResponseDto data);
    ActionResponce DeleteUserAction(int id);
}
