using ex1.Models;

namespace ex1.Interfaces.Repositorys
{
    public interface ILotteryRepository
    {
        Task<List<User>> GetRaffleEntries(int prizeId);
        Task SetWinner(int prizeId, int userId);
        Task<Prize> GetPrizeById(int prizeId);
    }
}
