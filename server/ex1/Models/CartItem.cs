namespace ex1.Models
{
    public class CartItem
    {
        public int Id { get; set; } 

        public int CartId { get; set; } 
        public virtual Cart Cart { get; set; }

        public int PrizeId { get; set; } 
        public virtual Prize Prize { get; set; }

        public int Quantity { get; set; } 
    }
}