using ex1.Models;

namespace ex1.Dto
{
    public class PrizePurchaseDto
    {
        public int PrizeId { get; set; }
        public string PrizeName { get; set; }
        public decimal TicketPrice { get; set; }
        public int TotalTicketsSold { get; set; }
    }
    public class PurchaserDetailDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int Quantity { get; set; }
    }
    //public class CartItemDto
    //{
    //    public int Id { get; set; }
    //    public string PrizeName { get; set; }
    //    public int Quantity { get; set; }
    //    public decimal Price { get; set; }
    //}
    public class CartItemDto
    {
        public int Id { get; set; }               // מזהה CartItem
        public int PrizeId { get; set; }
        public string PrizeName { get; set; } = "";
        public decimal TicketPrice { get; set; }  // מחיר פרס
        public string? ImagePath { get; set; }
        public int Quantity { get; set; }
    }



}


