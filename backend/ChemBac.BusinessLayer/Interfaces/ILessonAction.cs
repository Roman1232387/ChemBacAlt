using ChemBac.Domain.Models.Lesson;
using ChemBac.Domain.Models.Responces;

namespace ChemBac.BusinessLayer.Interfaces;

public interface ILessonAction
{
    List<LessonDto> GetAllLessonsAction();
    LessonDto? GetLessonByIdAction(int id);
    ActionResponce CreateLessonAction(LessonDto data);
    ActionResponce UpdateLessonAction(LessonDto data);
    ActionResponce DeleteLessonAction(int id);
}
