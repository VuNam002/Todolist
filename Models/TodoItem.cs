using project.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace project.Models
{
    [Table("TodoItem")]
    public class TodoItem
    {
        [Key]
        [Column("Id")]
        public int Id { get; set; }

        [Required]
        [Column("Title")]
        public string Title { get; set; } = string.Empty;

        [Column("Status")]
        public TodoStatus Status { get; set; }

    }
}
