using ChemBac.Domain.Models.Result;
using ChemBac.Domain.Models.Responces;

namespace ChemBac.BusinessLayer.Interfaces;

public interface IResultAction
{
    List<ResultDto> GetResultsByUserAction(int userId);
    ResultDto? GetResultByIdAction(int id);
    ActionResponce SubmitResultAction(ResultDto data);
}