using project.Models;

namespace project.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<TodoItem>> GetAllAsync();
        Task<TodoItem?> GetByIdAsync(int id); 
        Task<TodoItem> AddAsync(TodoItem todoItem);
        Task<bool> UpdateAsync(TodoItem todoItem);
        Task<bool> DeleteAsync(int id); 
    }
}