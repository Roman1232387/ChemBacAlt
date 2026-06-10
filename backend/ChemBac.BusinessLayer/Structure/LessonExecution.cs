using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Models.Responses;

namespace ChemBac.BusinessLayer.Structure;

public class LessonExecution : LessonActions, ILessonAction
{
    public List<LessonDto> GetAllLessonsAction()
    {
        return GetAllLessonsActionExecution();
    }

    public LessonDto? GetLessonByIdAction(int id)
    {
        return GetLessonByIdActionExecution(id);
    }

    public ActionResponse CreateLessonAction(LessonDto data)
    {
        return CreateLessonActionExecution(data);
    }

    public ActionResponse UpdateLessonAction(LessonDto data)
    {
        return UpdateLessonActionExecution(data);
    }

    public ActionResponse DeleteLessonAction(int id)
    {
        return DeleteLessonActionExecution(id);
    }
}
