using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Result;

namespace ChemBac.BusinessLayer.Structure;

public class ResultExecution : ResultActions, IResultAction
{
    public List<ResultDto> GetResultsByUserAction(int userId)
        => GetResultsByUserActionExecution(userId);

    public ResultDto? GetResultByIdAction(int id)
        => GetResultByIdActionExecution(id);

    public ActionResponce SubmitResultAction(ResultDto data)
        => SubmitResultActionExecution(data);
}