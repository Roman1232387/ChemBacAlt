using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.User;

namespace ChemBac.BusinessLayer.Structure;

public class UserExecution : UserActions, IUserAction
{
    public List<UserResponseDto> GetAllUsersAction()
    {
        return GetAllUsersActionExecution();
    }

    public UserResponseDto? GetUserByIdAction(int id)
    {
        return GetUserByIdActionExecution(id);
    }

    public ActionResponce RegisterUserAction(UserRegisterDto data)
    {
        return RegisterUserActionExecution(data);
    }

    public LoginResponseDto LoginUserAction(UserLoginDto data)
        => LoginUserActionExecution(data);

    public ActionResponce UpdateUserAction(UserResponseDto data)
    {
        return UpdateUserActionExecution(data);
    }

    public ActionResponce DeleteUserAction(int id)
    {
        return DeleteUserActionExecution(id);
    }
}
