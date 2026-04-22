using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Test;

namespace ChemBac.BusinessLayer.Structure;

public class TestExecution : TestActions, ITestAction
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
