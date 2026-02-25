using ex1.Dto;

namespace ex1.Interfaces.Services
{
    public interface IPrizeService
    {
        Task<IEnumerable<PrizeResponseDto>> GetAllPrizesAsync();
        Task<PrizeResponseDto> GetPrizeByIdAsync(int id);
        Task<IEnumerable<PrizeResponseDto>> SearchPrizeByNameAsync(string searchTerm);
        Task<IEnumerable<PrizeWithDonorDto>> GetPrizesWithDonorsAsync();
        Task<IEnumerable<PrizeResponseDto>> SearchPrizeByDonorNameAsync(string donorName);
        Task<IEnumerable<PrizeResponseDto>> searchPrizeByCountAsync(int count);
        Task<decimal?> GetTicketPriceByNameAsync(string prizeName);
        Task<PrizeResponseDto> CreatePrizeAsync(PrizeCreateDto createDto);
        Task<PrizeResponseDto?> UpdatePrizeAsync(int id, PrizeUpdateDto updateDto);
        Task<bool> DeletePrizeAsync(int id);
    }
}
