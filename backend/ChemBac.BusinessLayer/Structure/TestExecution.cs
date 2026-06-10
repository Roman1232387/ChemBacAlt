using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Responses;
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

    public ActionResponse CreateTestAction(TestDto data)
    {
        return CreateTestActionExecution(data);
    }

    public ActionResponse UpdateTestAction(TestDto data)
    {
        return UpdateTestActionExecution(data);
    }

    public ActionResponse DeleteTestAction(int id)
    {
        return DeleteTestActionExecution(id);
    }
}
