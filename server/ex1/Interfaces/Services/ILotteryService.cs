using ex1.DTOs;

namespace ex1.Interfaces.Services
{
    public interface ILotteryService
    {
        Task<LotteryResultDto> RafflePrizeAsync(int prizeId);
    }
}
