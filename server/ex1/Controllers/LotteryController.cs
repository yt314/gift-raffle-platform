using ex1.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ex1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "manager")]
    public class LotteryController : ControllerBase
    {
        private readonly ILotteryService _lotteryService;
        private readonly ILogger<LotteryController> _logger;

        public LotteryController(
            ILotteryService lotteryService,
            ILogger<LotteryController> logger)
        {
            _lotteryService = lotteryService;
            _logger = logger;
        }

        [HttpPost("raffle/{prizeId}")]
        public async Task<IActionResult> RafflePrize(int prizeId)
        {
            try
            {
                var result = await _lotteryService.RafflePrizeAsync(prizeId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "שגיאה בהגרלה עבור פרס {PrizeId}", prizeId);

                if (ex.Message.Contains("אין משתתפים"))
                    return BadRequest(new { message = ex.Message });

                if (ex.Message.Contains("כבר בוצעה"))
                    return Conflict(new { message = ex.Message });

                if (ex.Message.Contains("לא נמצאה"))
                    return NotFound(new { message = ex.Message });

                return StatusCode(500, new { message = "שגיאה פנימית בשרת" });
            }
        }
    }
}
