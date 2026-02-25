using ex1.Models;
using System.ComponentModel.DataAnnotations;

namespace ex1.Dto
{
    public class PrizeWithDonorDto
    {
        public string PrizeName { get; set; }
        public string DonorName { get; set; }
    }
    public class PrizeCreateDto
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required, Range(1, double.MaxValue)]
        public decimal TicketPrice { get; set; }
        public int CategoryId { get; set; }
        public string ImagePath { get; set; } = string.Empty;
        public int DonorId { get; set; }
        // ניהול הגרלה
        public bool IsRaffleDone { get; set; } = false;
    }
    public class PrizeUpdateDto
    {
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }
        [Required, Range(1, double.MaxValue)]
        public decimal TicketPrice { get; set; }
        public int CategoryId { get; set; }
        public string ImagePath { get; set; }
        public int DonorId { get; set; }
        public bool IsRaffleDone { get; set; } = false;
        public int? WinnerUserId { get; set; }

        // האם לכתוב מי הזוכה????
    }
    public class PrizeResponseDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        [Required, Range(1, double.MaxValue)]
        public decimal TicketPrice { get; set; }   
        public string ImagePath { get; set; }
        public int DonorId { get; set; }
        public bool IsRaffleDone { get; set; } = false;
        public int? WinnerUserId { get; set; }
        public int CategoryId { get; set; }

        //public virtual Donor Donor { get; set; }  // ניהול הגרלה
    }
    //public class AllPrizesDto
    //{
    //    public int Id { get; set; }
    //    [Required]
    //    public string Name { get; set; }
    //    public string Description { get; set; }
    //    [Required, Range(1, double.MaxValue)]
    //    public decimal TicketPrice { get; set; }  
    //    public string ImagePath { get; set; }

    //    public int CategoryId { get; set; }

    //    //public int DonorId { get; set; }???????
    //    public int? WinnerUserId { get; set; }
    //    //public virtual Donor Donor { get; set; }  // ניהול הגרלה
    //    public bool IsRaffleDone { get; set; } = false;
    //}
}
