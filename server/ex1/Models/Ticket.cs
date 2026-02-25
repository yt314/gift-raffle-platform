using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ex1.Models
{
    public class Ticket
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        public int PrizeId { get; set; }

        [ForeignKey("PrizeId")]
        public virtual Prize Prize { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")] // הגדרה מדויקת ל-SQL עבור כסף
        public decimal TotalPrice { get; set; }
    }
}