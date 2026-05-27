using ChemBac.BusinessLayer.Interfaces;
using ChemBac.BusinessLayer.Structure;

namespace ChemBac.BusinessLayer;

public class BusinessLogic
{
    public BusinessLogic() { }

    public ILessonAction LessonAction()
    {
        return new LessonExecution();
    }

    public ITestAction TestAction()
    {
        return new TestExecution();
    }

    public IUserAction UserAction()
    {
        return new UserExecution();
    }

    public IAuthAction AuthAction()
    {
        return new AuthExecution();
    }

    public IResultAction ResultAction()
    {
        return new ResultExecution();
    }
}
