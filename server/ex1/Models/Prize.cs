using System.ComponentModel.DataAnnotations;

namespace ex1.Models
{
    public class Prize
    {
        public int Id { get; set; } 
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal TicketPrice { get; set; } 
        public int CategoryId { get; set; } 
        public virtual Category category { get; set; }
        public string ImagePath { get; set; } 
        public int DonorId { get; set; } 
        public virtual Donor Donor { get; set; }
        // ניהול הגרלה
        public bool IsRaffleDone { get; set; } = false; 
        public int? WinnerUserId { get; set; } 
        public virtual User Winner { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}