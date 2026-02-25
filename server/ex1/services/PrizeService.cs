using ex1.Dto;
using ex1.Interfaces.Repositorys;
using ex1.Interfaces.Services;
using ex1.Models;
using ex1.Repository;
using System.ComponentModel.DataAnnotations;

namespace ex1.services
{
    public class PrizeService : IPrizeService
    {
        private readonly IPrizeRepository _prizeRepository;

        public PrizeService(IPrizeRepository prizeRepository)
        {
            _prizeRepository = prizeRepository;
        }

        public async Task<IEnumerable<PrizeResponseDto>> GetAllPrizesAsync()
        {
            var donors = await _prizeRepository.GetAllAsync();

            return donors.Select(MapToResponseDto);
        }

        public async Task<PrizeResponseDto> CreatePrizeAsync(PrizeCreateDto createDto)
        {
            var prize = new Prize
            {
                Name = createDto.Name,
                Description = createDto.Description,
                TicketPrice = createDto.TicketPrice,
                CategoryId = createDto.CategoryId,
                ImagePath = createDto.ImagePath,
                DonorId = createDto.DonorId,
                IsRaffleDone = createDto.IsRaffleDone,
            };

            var createdDonor = await _prizeRepository.CreateAsync(prize);

            return MapToResponseDto(createdDonor);
        }

        public async Task<PrizeResponseDto?> GetPrizeByIdAsync(int id)
        {
            var prize = await _prizeRepository.GetByIdAsync(id);
            return prize != null ? MapToResponseDto(prize) : null;
        }

        public async Task<IEnumerable<PrizeResponseDto>> SearchPrizeByNameAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Enumerable.Empty<PrizeResponseDto>();
            }

            var prizes = await _prizeRepository.SearchByNameAsync(searchTerm);
            return prizes.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<PrizeResponseDto>> SearchPrizeByDonorNameAsync(string donorName)
        {
            if (string.IsNullOrWhiteSpace(donorName))
            {
                return Enumerable.Empty<PrizeResponseDto>();
            }

            var prizes = await _prizeRepository.SearchByDonorNameAsync(donorName);
            return prizes.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<PrizeResponseDto>> searchPrizeByCountAsync(int count)
        {
            if (count < 0)
            {
                return Enumerable.Empty<PrizeResponseDto>();
            }

            var prizes = await _prizeRepository.SearchByCountAsync(count);
            return prizes.Select(MapToResponseDto);
        }

        public async Task<PrizeResponseDto?> UpdatePrizeAsync(int id, PrizeUpdateDto updateDto)
        {
            var existingDonor = await _prizeRepository.GetByIdAsync(id);
            if (existingDonor == null) return null;

            if (!string.IsNullOrEmpty(updateDto.Name)) existingDonor.Name = updateDto.Name;
            if (!string.IsNullOrEmpty(updateDto.Description)) existingDonor.Description = updateDto.Description;
            if (updateDto.TicketPrice != default) existingDonor.TicketPrice = updateDto.TicketPrice;
            if (!string.IsNullOrEmpty(updateDto.ImagePath)) existingDonor.ImagePath = updateDto.ImagePath;     
            if (updateDto.DonorId != default) existingDonor.DonorId = updateDto.DonorId;
            if (updateDto.IsRaffleDone != existingDonor.IsRaffleDone) existingDonor.IsRaffleDone = updateDto.IsRaffleDone;
            if (updateDto.WinnerUserId.HasValue) existingDonor.WinnerUserId = updateDto.WinnerUserId;
            if (updateDto.CategoryId != default) existingDonor.CategoryId = updateDto.CategoryId;

            var updatedDonor = await _prizeRepository.UpdateAsync(existingDonor);
            return updatedDonor != null ? MapToResponseDto(updatedDonor) : null;
        }
        public async Task<bool> DeletePrizeAsync(int id)
        {
            return await _prizeRepository.DeleteAsync(id);
        }

        async Task<IEnumerable<PrizeWithDonorDto?>> IPrizeService.GetPrizesWithDonorsAsync()
        {
            var prizes = await _prizeRepository.GetPrizesWithDonorsAsync();
            return prizes?.Select(p => p == null
                ? null
                : new PrizeWithDonorDto
                {
                    PrizeName = p.PrizeName,
                    DonorName = p.DonorName
                }) ?? Enumerable.Empty<PrizeWithDonorDto?>();
        }

        public async Task<decimal?> GetTicketPriceByNameAsync(string prizeName)
        {
            return await _prizeRepository.GetTicketPriceByNameAsync(prizeName);
        }

        private static PrizeResponseDto MapToResponseDto(Prize prize)
        {
            return new PrizeResponseDto
            {
                Id = prize.Id,
                Name = prize.Name,
                Description = prize.Description,
                TicketPrice = prize.TicketPrice,
                CategoryId = prize.CategoryId,
                //category = prize.category,  
                ImagePath = prize.ImagePath,
                DonorId = prize.DonorId,
                IsRaffleDone = prize.IsRaffleDone,
                WinnerUserId=prize.WinnerUserId
            };
        }


    }
}
