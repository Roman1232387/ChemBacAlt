using ChemBac.BusinessLayer.Interfaces;
using ChemBac.BusinessLayer.Services;

namespace ChemBac.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic()
    {
        Lessons = new LessonService();
        Tests = new TestService();
        Users = new UserService();
        Results = new ResultService();
        Auth = new AuthService();
    }

    public ILessonAction Lessons { get; }
    public ITestAction Tests { get; }
    public IUserAction Users { get; }
    public IResultAction Results { get; }
    public IAuthAction Auth { get; }

    public ILessonAction LessonAction()
    {
        return Lessons;
    }

    public ITestAction TestAction()
    {
        return Tests;
    }

    public IUserAction UserAction()
    {
        return Users;
    }

    public IAuthAction AuthAction()
    {
        return Auth;
    }

    public IResultAction ResultAction()
    {
        return Results;
    }
}
