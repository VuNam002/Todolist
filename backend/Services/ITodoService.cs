using project.Models;

namespace project.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<TodoItem>> GetAllAsync();
        Task<TodoItem?> GetByIdAsync(long id);
        Task<TodoItem> AddAsync(TodoItem item);
        Task<bool> UpdateAsync(TodoItem item);
        Task<bool> DeleteAsync(long id);
        Task<bool> UpdateStatusTodo(long id, string newStatus);
    }
}