using ChemBac.Domain.Models.Result;
using ChemBac.Domain.Models.Responses;

namespace ChemBac.BusinessLayer.Interfaces;

public interface IResultAction
{
    List<ResultDto> GetResultsByUserAction(int userId);
    List<ResultDto> GetAllResultsAction();
    ResultDto? GetResultByIdAction(int id);
    ActionResponse SubmitResultAction(ResultDto data);
}
