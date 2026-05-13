using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Test;

namespace ChemBac.BusinessLayer.Interfaces;

public interface ITestAction
{
    List<TestDto> GetAllTestsAction();
    TestDto? GetTestByIdAction(int id);
    ActionResponce CreateTestAction(TestDto data);
    ActionResponce UpdateTestAction(TestDto data);
    ActionResponce DeleteTestAction(int id);
}
