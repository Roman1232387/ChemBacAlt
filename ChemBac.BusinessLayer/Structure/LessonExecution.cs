using ChemBac.BusinessLayer.Core;
using ChemBac.BusinessLayer.Interfaces;
using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Models.Responces;

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

    public ActionResponce CreateLessonAction(LessonDto data)
    {
        return CreateLessonActionExecution(data);
    }

    public ActionResponce UpdateLessonAction(LessonDto data)
    {
        return UpdateLessonActionExecution(data);
    }

    public ActionResponce DeleteLessonAction(int id)
    {
        return DeleteLessonActionExecution(id);
    }
}
