using ex1.Models;
using System.ComponentModel.DataAnnotations;

namespace ex1.Dto
{
    public class DonorCreateDto
    {
        //public int Id { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string Phone { get; set; }

    }
    public class DonorUpdateDto
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        [Phone]
        public string Phone { get; set; }
    }

    public class DonorResponseDto
    {
        public int Id { get; set; }

        [Required]
        public string  FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string Phone { get; set; }

        public List<string> PrizesNames { get; set; } = new List<string>();
    }

}
