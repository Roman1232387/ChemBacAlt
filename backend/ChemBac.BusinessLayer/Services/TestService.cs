using ChemBac.BusinessLayer.Interfaces;
using ChemBac.BusinessLayer.Core;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Test;

namespace ChemBac.BusinessLayer.Services;

public class TestService : TestActions, ITestAction
{
    public List<TestDto> GetAllTestsAction()
    {
        return GetAllTestsActionExecution();
    }

    public TestDto? GetTestByIdAction(int id)
    {
        return GetTestByIdActionExecution(id);
    }

    public ActionResponce CreateTestAction(TestDto data)
    {
        return CreateTestActionExecution(data);
    }

    public ActionResponce UpdateTestAction(TestDto data)
    {
        return UpdateTestActionExecution(data);
    }

    public ActionResponce DeleteTestAction(int id)
    {
        return DeleteTestActionExecution(id);
    }
}
