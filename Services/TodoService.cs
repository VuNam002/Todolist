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
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<IEnumerable<TodoItem>> GetAllAsync()
        {   
         try
            {
                return await _context.TodoItems.ToListAsync();

            } catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while retrieving TodoItems: {ex.Message}");
                throw; 
            }
        }

        public async Task<TodoItem?> GetByIdAsync(int id)
        {
            try
            {
                return await _context.TodoItems.FindAsync(id);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while retrieving TodoItem with ID {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<TodoItem?> GetByIdAsync(long id)
        {
            // Call the existing int overload for compatibility
            return await GetByIdAsync((int)id);
        }

        public async Task<TodoItem> AddAsync(TodoItem item)
        {
            try
            {
                if (item == null)
                {
                    throw new ArgumentNullException(nameof(item));
                }
                _context.TodoItems.Add(item);
                await _context.SaveChangesAsync();
                return item;
            } catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while adding a new TodoItem: {ex.Message}");
                throw;
            }
        }

        // Cập nhật một TodoItem
        public async Task<bool> UpdateAsync(TodoItem item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.TodoItems.Any(e => e.Id == item.Id))
                {
                    return false; 
                }
                throw; 
            }
        }

        // Xóa một TodoItem theo Id
        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var item = await _context.TodoItems.FindAsync(id);
                if (item == null) return false;

                _context.TodoItems.Remove(item);
                await _context.SaveChangesAsync();
                return true;
            } catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while deleting TodoItem with ID {id}: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> DeleteAsync(long id)
        {
            // Call the existing int overload for compatibility
            return await DeleteAsync((int)id);
        }
    }
}