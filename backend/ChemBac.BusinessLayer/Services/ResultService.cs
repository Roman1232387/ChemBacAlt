using ChemBac.BusinessLayer.Interfaces;
using ChemBac.BusinessLayer.Core;
using ChemBac.Domain.Models.Responces;
using ChemBac.Domain.Models.Result;

namespace ChemBac.BusinessLayer.Services;

public class ResultService : ResultActions, IResultAction
{
    public List<ResultDto> GetResultsByUserAction(int userId)
    {
        return GetResultsByUserActionExecution(userId);
    }

    public ResultDto? GetResultByIdAction(int id)
    {
        return GetResultByIdActionExecution(id);
    }

    public ActionResponce SubmitResultAction(ResultDto data)
    {
        return SubmitResultActionExecution(data);
    }
}
