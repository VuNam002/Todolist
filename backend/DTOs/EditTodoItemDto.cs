using project.Enums;

namespace project.DTOs
{
    public class EditTodoItemDto
    {
        public string? Title { get; set; }
        public TodoStatus? Status { get; set; } 
        public string? Describe { get; set; }
    }
}