using ex1.Data;
using ex1.Interfaces.Repositorys;
using ex1.Models;
using Microsoft.EntityFrameworkCore;

namespace ex1.Repository
{
    public class LotteryRepository : ILotteryRepository
    {
        private readonly StoreContext _context;

        public LotteryRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetRaffleEntries(int prizeId)
        {
            return await _context.CartItems
                .Include(ci => ci.Cart)
                .Include(ci => ci.Cart.User)
                .Where(ci =>
                    ci.PrizeId == prizeId &&
                    ci.Cart.Status == CartStatus.Paid)
                .Select(ci => ci.Cart.User!)
                .Distinct()
                .ToListAsync();
        }

        public async Task<Prize> GetPrizeById(int prizeId)
        {
            return await _context.Prizes
                .FirstOrDefaultAsync(p => p.Id == prizeId)
                ?? throw new Exception("הפרס לא נמצא");
        }

        public async Task SetWinner(int prizeId, int userId)
        {
            var prize = await _context.Prizes.FindAsync(prizeId)
                ?? throw new Exception("הפרס לא נמצא");

            if (prize.IsRaffleDone)
                throw new Exception("כבר בוצעה הגרלה לפרס זה");

            prize.WinnerUserId = userId;
            prize.IsRaffleDone = true;

            await _context.SaveChangesAsync();
        }
    }
}
