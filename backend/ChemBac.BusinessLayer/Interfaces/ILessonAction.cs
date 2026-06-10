using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Models.Responses;

namespace ChemBac.BusinessLayer.Interfaces;

public interface ILessonAction
{
    List<LessonDto> GetAllLessonsAction();
    LessonDto? GetLessonByIdAction(int id);
    ActionResponse CreateLessonAction(LessonDto data);
    ActionResponse UpdateLessonAction(LessonDto data);
    ActionResponse DeleteLessonAction(int id);
}
