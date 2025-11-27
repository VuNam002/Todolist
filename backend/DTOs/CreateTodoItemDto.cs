using project.Enums;

namespace project.DTOs
{
    public class CreateTodoItemDto
    {
        public string? Title { get; set; }
        public TodoStatus Status { get; set; }
    }
}
