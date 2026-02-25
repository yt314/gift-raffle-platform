using ex1.Dto;
using ex1.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ex1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService) => _cartService = cartService;

        [HttpPost("addToCart")]
        [Authorize]
        public async Task<IActionResult> addToCart(int userId, int prizeId)
        {
            var result = await _cartService.AddPrizeToCart(userId, prizeId);
            return Ok(result);
        }
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetCartItemsByUser(int userId)
        {
            var items = await _cartService.GetCartItemsByUserAsync(userId);
            return Ok(items);
        }

        [HttpGet("getAllSales")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PrizePurchaseDto>>> GetAllSales()
        {
            return Ok(await _cartService.GetAllSalesAsync());
        }
        [HttpGet("getMostExpensive")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<PrizePurchaseDto>>> GetExpensive()
        {
            var sales = await _cartService.GetExpensiveSalesAsync();
            return Ok(sales);
        }
        [HttpGet("getMostPopular")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<PrizePurchaseDto>>> GetPopular()
        {
            return Ok(await _cartService.GetPopularSalesAsync());
        }

        [HttpGet("getPurchasers/{prizeId}")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<IEnumerable<PurchaserDetailDto>>> GetPurchasers(int prizeId)
        {
            return Ok(await _cartService.GetPurchasersByPrizeAsync(prizeId));
        }

        [HttpPut("updateQuantity/{cartItemId}")]
        [Authorize]
        public async Task<IActionResult> UpdateQuantity(int cartItemId, [FromBody] int quantity)
        {
            return Ok(await _cartService.UpdateItemQuantityAsync(cartItemId, quantity));
        }
        //[HttpPut("addOne/{cartItemId}")]
        //[Authorize]
        //public async Task<ActionResult<IEnumerable<PrizePurchaseDto>>> addOne(int cartItemId)
        //{
        //    var result = await _cartService.addOneAsync(cartItemId);
        //    if (result == null) return NotFound(new { message = "Item not found" });
        //    return Ok(result);
        //}

        [HttpPut("removeOne/{cartItemId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> removeOne(int cartItemId)
        {
            var result = await _cartService.removeOneAsync(cartItemId);
            if (result == null) return NotFound(new { message = "Item not found" });
            return Ok(result);
        }

        [HttpDelete("deleteItem/{cartItemId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CartItemDto>>> DeleteItem(int cartItemId)
        {
            var result = await _cartService.DeleteItemAsync(cartItemId);
            if (result == null) return NotFound(new { message = "Item not found" });
            return Ok(result);
        }

[HttpPost("pay/{userId}")]
[Authorize]
public async Task<IActionResult> Pay(int userId)
{
    var ok = await _cartService.PayCartAsync(userId);
    if (!ok) return BadRequest(new { message = "Cart is empty or already paid" });
    return Ok(new { message = "Paid", status = 1 });
}

    }
}
