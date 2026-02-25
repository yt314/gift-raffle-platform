using System.ComponentModel.DataAnnotations;

namespace ex1.Models
{
    public enum CartStatus
    {
        Draft,    // סל פתוח
        Paid,     // שולם
    }

    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
        public CartStatus Status { get; set; } = CartStatus.Draft;
        public virtual ICollection<CartItem> Items { get; set; }
    }
}