using Microsoft.EntityFrameworkCore;
using project.Data;
using project.Models;

namespace project.Services
{
    // Service Layer cho Todo API
    public class TodoService : ITodoService
    {
        private readonly TodoContext _context;

        // Nhận DbContext qua Dependency Injection
        public TodoService(TodoContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        // Lấy tất cả các TodoItem
        public async Task<IEnumerable<TodoItem>> GetAllAsync()
        {
            return await _context.TodoItems.ToListAsync();
        }

        // Lấy TodoItem theo Id
        public async Task<TodoItem?> GetByIdAsync(long id)
        {
            return await _context.TodoItems.FindAsync(id);
        }

        // Thêm một TodoItem mới
        public async Task<TodoItem> AddAsync(TodoItem item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));

            _context.TodoItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        // Cập nhật một TodoItem
        public async Task<bool> UpdateAsync(TodoItem item)
        {
            if (item == null) throw new ArgumentNullException(nameof(item));

            // Đánh dấu trạng thái là Modified
            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                // Kiểm tra xem TodoItem có tồn tại không
                if (!_context.TodoItems.Any(e => e.Id == item.Id))
                {
                    return false; // Không tìm thấy
                }
                throw; // Ném lại ngoại lệ nếu có lỗi khác
            }
        }

        // Xóa một TodoItem theo Id
        public async Task<bool> DeleteAsync(long id)
        {
            var item = await _context.TodoItems.FindAsync(id);
            if (item == null) return false;

            _context.TodoItems.Remove(item);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}