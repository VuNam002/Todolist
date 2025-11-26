using Microsoft.AspNetCore.Mvc;
using project.DTOs;
using project.Models;
using project.Services;

namespace project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodoItemsController : ControllerBase
    {
        private readonly ITodoService _todoService;
        private readonly ILogger<TodoItemsController> _logger;

        public TodoItemsController(ITodoService todoService, ILogger<TodoItemsController> logger)
        {
            _todoService = todoService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoItem>>> GetTodoItems()
        {
            try
            {
                var todoItems = await _todoService.GetAllAsync();
                return Ok(todoItems); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving todo items");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodoItem(long id)
        {
            try
            {
                var todoItem = await _todoService.GetByIdAsync(id);

                if (todoItem == null)
                {
                    return NotFound();
                }

                return todoItem;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving todo item with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<TodoItem>> PostTodoItem(CreateTodoItemDto dto)
        {
            try
            {
                var todoItem = new TodoItem
                {
                    Title = dto.Title ?? string.Empty,
                    Status = dto.Status
                };
                var createdItem = await _todoService.AddAsync(todoItem);
                return CreatedAtAction(
                    actionName: nameof(GetTodoItem),
                    routeValues: new { id = createdItem.Id },
                    value: createdItem
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating new todo item");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PutTodoItem(long id, TodoItem todoItem)
        {
            try
            {
                if (id != todoItem.Id)
                {
                    return BadRequest();
                }

                var result = await _todoService.UpdateAsync(todoItem);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating todo item with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/TodoItems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoItem(long id)
        {
            try
            {
                var result = await _todoService.DeleteAsync(id);
                if (!result)
                {
                    return NotFound();
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting todo item with id {Id}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}