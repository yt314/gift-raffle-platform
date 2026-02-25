using ex1.Models;

namespace ex1.Interfaces.Repositorys
{
    public interface ICartRepository
    {
        Task<Cart> GetOrCreateDraftCartByUserId(int userId);
        Task<bool> MarkCartAsPaidAsync(int userId);
        Task<CartItem?> GetItemByIdAsync(int cartItemId); // נוסף לפתרון השגיאה
        Task<CartItem?> GetItemInCart(int cartId, int prizeId);
        Task<CartItem> AddItem(CartItem item);
        Task<CartItem> UpdateItem(CartItem item);
        Task<List<CartItem>> GetCartItemsByCartIdAsync(int cartId);
        Task<bool> UpdateItemQuantityAsync(int cartItemId, int newQuantity);
        Task<bool> DeleteItemAsync(int cartItemId); // נוסף לפתרון השגיאה
        Task<List<Cart>> GetAllPaidCarts();
        Task<List<CartItem>> GetPaidItemsByPrizeId(int prizeId);
        
    }
}

