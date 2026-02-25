using ex1.Dto;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ex1.Interfaces.Services
{
    public interface IDonorService
    {
        Task<IEnumerable<DonorResponseDto>> GetAllDonorsAsync();
        Task<DonorResponseDto?> GetDonorByIdAsync(int id);
        Task<IEnumerable<DonorResponseDto>> SearchDonorByNameAsync(string searchTerm);
        Task<DonorResponseDto> CreateDonorAsync(DonorCreateDto createDto);
        Task<DonorResponseDto?> UpdateDonorAsync(int id, DonorUpdateDto updateDto);
        Task<bool> DeleteDonorAsync(int id);

    }
}


