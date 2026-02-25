using ex1.Dto;
using ex1.Interfaces.Repositorys;
using ex1.Interfaces.Services;
using ex1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ex1.services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }


        public async Task<bool> AddPrizeToCart(int userId, int prizeId)
        {
            var cart = await _cartRepository.GetOrCreateDraftCartByUserId(userId);

            var item = await _cartRepository.GetItemInCart(cart.Id, prizeId);

            if (item == null)
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    PrizeId = prizeId,
                    Quantity = 1
                };
                await _cartRepository.AddItem(newItem);
            }
            else
            {
                item.Quantity += 1;
                await _cartRepository.UpdateItem(item);
            }

            return true;
        }

        public async Task<bool> UpdateItemQuantityAsync(int cartItemId, int newQuantity)
        {
            if (newQuantity <= 0) return false;
            return await _cartRepository.UpdateItemQuantityAsync(cartItemId, newQuantity);
        }


        
        public async Task<IEnumerable<CartItemDto>> GetCartItemsByUserAsync(int userId)
        {
            var cart = await _cartRepository.GetOrCreateDraftCartByUserId(userId);
            var items = await _cartRepository.GetCartItemsByCartIdAsync(cart.Id);

            return items.Select(i => new CartItemDto
            {
                Id = i.Id,
                PrizeId = i.PrizeId,
                PrizeName = i.Prize?.Name ?? "Unknown",
                TicketPrice = i.Prize?.TicketPrice ?? 0,
                ImagePath = i.Prize?.ImagePath,
                Quantity = i.Quantity
            }).ToList();
        }


public async Task<bool> PayCartAsync(int userId)
{
    // מסמן את סל ה-Draft של המשתמש כשולם (Status=Paid)
    return await _cartRepository.MarkCartAsPaidAsync(userId);
}


public async Task<IEnumerable<PrizePurchaseDto>> GetAllSalesAsync()
        {
            var paidCarts = await _cartRepository.GetAllPaidCarts();

            var allItems = paidCarts.SelectMany(c => c.Items);

            return allItems.GroupBy(i => i.PrizeId).Select(g => new PrizePurchaseDto
            {
                PrizeId = g.Key,
                PrizeName = g.First().Prize != null ? g.First().Prize.Name : "Unknown",
                TicketPrice = g.First().Prize != null ? g.First().Prize.TicketPrice : 0,
                TotalTicketsSold = g.Sum(i => i.Quantity)
            });
        }

        public async Task<IEnumerable<PrizePurchaseDto>> GetExpensiveSalesAsync()
        {
            var sales = await GetAllSalesAsync();
            return sales.OrderByDescending(s => s.TicketPrice);
        }

        public async Task<IEnumerable<PrizePurchaseDto>> GetPopularSalesAsync()
        {
            var sales = await GetAllSalesAsync();
            return sales.OrderByDescending(s => s.TotalTicketsSold);
        }

        public async Task<IEnumerable<PurchaserDetailDto>> GetPurchasersByPrizeAsync(int prizeId)
        {
            var items = await _cartRepository.GetPaidItemsByPrizeId(prizeId);

            return items.Select(i => new PurchaserDetailDto
            {
                FullName = $"{i.Cart.User.FirstName} {i.Cart.User.LastName}",
                Email = i.Cart.User.Email,
                Phone = i.Cart.User.Phone,
                Quantity = i.Quantity
            });
        }
        // פונקציית העזר שפותרת את שגיאה CS0103
                private async Task<IEnumerable<CartItemDto>> GetCartItemsDtoByCartId(int cartId)
        {
            var items = await _cartRepository.GetCartItemsByCartIdAsync(cartId);

            return items.Select(i => new CartItemDto
            {
                Id = i.Id,
                PrizeId = i.PrizeId,
                PrizeName = i.Prize?.Name ?? "Unknown",
                TicketPrice = i.Prize?.TicketPrice ?? 0,
                ImagePath = i.Prize?.ImagePath,
                Quantity = i.Quantity
            }).ToList();
        }

        //public async Task<IEnumerable<PrizePurchaseDto>> addOneAsync(int cartItemId)
        //{
        //    var item = await _cartRepository.GetItemByIdAsync(cartItemId);
        //    if (item == null) return null;

        //    item.Quantity += 1;
        //    await _cartRepository.UpdateItem(item);
        //    return await GetCartItemsDtoByCartId(item.CartId);
        //}

        public async Task<IEnumerable<CartItemDto>> removeOneAsync(int cartItemId)
        {
            var item = await _cartRepository.GetItemByIdAsync(cartItemId);
            if (item == null) return null;

            if (item.Quantity <= 1)
                await _cartRepository.DeleteItemAsync(cartItemId);
            else
            {
                item.Quantity -= 1;
                await _cartRepository.UpdateItem(item);
            }
            return await GetCartItemsDtoByCartId(item.CartId);
        }

        public async Task<IEnumerable<CartItemDto>> DeleteItemAsync(int cartItemId)
        {
            var item = await _cartRepository.GetItemByIdAsync(cartItemId);
            if (item == null) return null;

            int cartId = item.CartId;
            await _cartRepository.DeleteItemAsync(cartItemId);
            return await GetCartItemsDtoByCartId(cartId);
        }
    }

}