using Microsoft.EntityFrameworkCore;
using ex1.Data;
using ex1.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ex1.Interfaces.Repositorys;

namespace ex1.Repository
{
    public class CartRepository : ICartRepository
    {
        private readonly StoreContext _context;

        public CartRepository(StoreContext context)
        {
            _context = context;
        }


        public async Task<Cart> GetOrCreateDraftCartByUserId(int userId)
        {
            var cart = await _context.Carts
                .FirstOrDefaultAsync(c => c.UserId == userId && c.Status == CartStatus.Draft);

            if (cart == null)
            {
                cart = new Cart { UserId = userId, Status = CartStatus.Draft };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }
            return cart;
        }

        public async Task<CartItem?> GetItemInCart(int cartId, int prizeId)
        {
            return await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cartId && ci.PrizeId == prizeId);
        }

        public async Task<CartItem> AddItem(CartItem item)
        {
            _context.CartItems.Add(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<CartItem> UpdateItem(CartItem item)
        {
            _context.CartItems.Update(item);
            await _context.SaveChangesAsync();
            return item;
        }

        public async Task<bool> UpdateItemQuantityAsync(int cartItemId, int newQuantity)
        {
            var item = await _context.CartItems.FindAsync(cartItemId);
            if (item == null) return false;

            item.Quantity = newQuantity;
            return await _context.SaveChangesAsync() > 0;
        }



        public async Task<List<CartItem>> GetCartItemsByCartIdAsync(int cartId)
        {
            return await _context.CartItems
                .Include(ci => ci.Prize)
                .Where(ci => ci.CartId == cartId)
                .ToListAsync();
        }

        public async Task<List<Cart>> GetAllPaidCarts()
        {
            return await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Prize) 
                .Where(c => c.Status == CartStatus.Paid)
                .ToListAsync();
        }

        public async Task<List<CartItem>> GetPaidItemsByPrizeId(int prizeId)
        {
            return await _context.CartItems
                .Include(ci => ci.Cart)
                .ThenInclude(c => c.User)
                .Where(ci => ci.PrizeId  == prizeId && ci.Cart.Status == CartStatus.Paid)
                .ToListAsync();
        }

public async Task<bool> MarkCartAsPaidAsync(int userId)
{
    var cart = await _context.Carts
        .Include(c => c.Items)
        .FirstOrDefaultAsync(c => c.UserId == userId && c.Status == CartStatus.Draft);

    if (cart == null) return false;

    // אם אין פריטים בסל, לא משלמים
    var hasItems = cart.Items != null && cart.Items.Any();
    if (!hasItems) return false;

    cart.Status = CartStatus.Paid;
    return await _context.SaveChangesAsync() > 0;
}


        public async Task<bool> DeleteItemAsync(int cartItemId)
        {
            var item = await _context.CartItems.FindAsync(cartItemId);
            if (item == null) return false;

            _context.CartItems.Remove(item);
            return await _context.SaveChangesAsync() > 0;
        }
        public async Task<CartItem?> GetItemByIdAsync(int cartItemId)
        {
            return await _context.CartItems
                .Include(ci => ci.Prize)
                .Include(ci => ci.Cart)
                .FirstOrDefaultAsync(ci => ci.Id == cartItemId);
        }
    }
}