using ex1.Dto;

namespace ex1.Interfaces.Services
{
    public interface ICartService
    {
        Task<IEnumerable<CartItemDto>> removeOneAsync(int cartItemId);
        Task<IEnumerable<CartItemDto>> DeleteItemAsync(int cartItemId);

        Task<bool> AddPrizeToCart(int userId, int prizeId);
        Task<IEnumerable<CartItemDto>> GetCartItemsByUserAsync(int userId);

        Task<bool> PayCartAsync(int userId);

        Task<IEnumerable<PrizePurchaseDto>> GetAllSalesAsync();
        Task<IEnumerable<PrizePurchaseDto>> GetExpensiveSalesAsync();
        Task<IEnumerable<PrizePurchaseDto>> GetPopularSalesAsync();
        Task<IEnumerable<PurchaserDetailDto>> GetPurchasersByPrizeAsync(int prizeId);
        Task<bool> UpdateItemQuantityAsync(int cartItemId, int newQuantity);
    }
}
  