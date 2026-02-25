using ex1.Dto;
using ex1.Models;

namespace ex1.Interfaces.Repositorys
{
    public interface IPrizeRepository
    {
        Task<IEnumerable<Prize>> GetAllAsync();
        Task<Prize?> GetByIdAsync(int id);
        Task<IEnumerable<Prize>> SearchByNameAsync(string searchTerm);
        Task<IEnumerable<PrizeWithDonorDto>> GetPrizesWithDonorsAsync();
        Task<IEnumerable<Prize>> SearchByDonorNameAsync(string donorName);
        Task<IEnumerable<Prize>> SearchByCountAsync(int count);
        Task<decimal?> GetTicketPriceByNameAsync(string prizeName);
        Task<Prize> CreateAsync(Prize prize);
        Task<Prize?> UpdateAsync(Prize prize);
        Task<bool> DeleteAsync(int id);
    }
}
