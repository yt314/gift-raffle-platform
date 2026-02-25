using System.ComponentModel.DataAnnotations;

namespace ex1.Models
{
    public class Donor
    {
        public int Id { get; set; } 
        public string FirstName { get; set; } 
        public string LastName { get; set; } 
        public string Email { get; set; } 
        public string Phone { get; set; } 
        // רשימת המתנות שנתרמו על ידו
        public virtual ICollection<Prize> Prizes { get; set; } 
    }
}
