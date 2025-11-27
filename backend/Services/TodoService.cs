using Microsoft.EntityFrameworkCore;
using project.Data;
using project.Models;

namespace project.Services
{
    public class TodoService : ITodoService
    {
        private readonly TodoContext _context;

        public TodoService(TodoContext context)
        {
            _context = context;
        }

        public async Task<TodoItem> AddAsync(TodoItem todoItem)
        {
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();
            return todoItem;
        }

        public async Task<bool> DeleteAsync(int id) 
        {
            var todoItem = await _context.TodoItems.FindAsync(id);
            if (todoItem == null)
            {
                return false;
            }

            _context.TodoItems.Remove(todoItem);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<TodoItem>> GetAllAsync()
        {
            return await _context.TodoItems.ToListAsync();
        }

        public async Task<TodoItem?> GetByIdAsync(int id) 
        {
            return await _context.TodoItems.FindAsync(id);
        }

        public async Task<bool> UpdateAsync(TodoItem todoItem)
        {
            _context.Entry(todoItem).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await TodoItemExists(todoItem.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }
        }

        private async Task<bool> TodoItemExists(int id) 
        {
            return await _context.TodoItems.AnyAsync(e => e.Id == id);
        }
    }
}