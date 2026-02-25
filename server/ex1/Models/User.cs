using ex1.Models;
using System.ComponentModel.DataAnnotations;
using System.Net.Sockets;

namespace ex1.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "user";// "manager" or "user"
        public string Address { get; set; }
        public DateTime SignAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public virtual ICollection<Ticket> Tickets { get; set; }
    }
}