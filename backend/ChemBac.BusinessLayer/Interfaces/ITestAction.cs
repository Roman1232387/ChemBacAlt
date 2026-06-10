using ChemBac.Domain.Models.Responses;
using ChemBac.Domain.Models.Test;

namespace ChemBac.BusinessLayer.Interfaces;

public interface ITestAction
{
    List<TestDto> GetAllTestsAction();
    TestDto? GetTestByIdAction(int id);
    ActionResponse CreateTestAction(TestDto data);
    ActionResponse UpdateTestAction(TestDto data);
    ActionResponse DeleteTestAction(int id);
}
