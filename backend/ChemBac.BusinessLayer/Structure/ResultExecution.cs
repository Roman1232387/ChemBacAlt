using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Responses;
using ChemBac.Domain.Models.Result;

namespace ChemBac.BusinessLayer.Structure;

public class ResultExecution : ResultActions, IResultAction
{
    public List<ResultDto> GetResultsByUserAction(int userId)
        => GetResultsByUserActionExecution(userId);

    public List<ResultDto> GetAllResultsAction()
        => GetAllResultsActionExecution();

    public ResultDto? GetResultByIdAction(int id)
        => GetResultByIdActionExecution(id);

    public ActionResponse SubmitResultAction(ResultDto data)
        => SubmitResultActionExecution(data);
}
