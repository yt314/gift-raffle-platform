using ex1.Dto;
using ex1.Interfaces.Repositorys;
using ex1.Interfaces.Services;
using ex1.Models;
using ex1.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ex1.services
{
    public class DonorService : IDonorService
    {
        private readonly IDonorRepository _donorRepository;

        public DonorService(IDonorRepository donorRepository)
        {
            _donorRepository = donorRepository;
        }

        public async Task<IEnumerable<DonorResponseDto>> GetAllDonorsAsync()
        {
            var donors = await _donorRepository.GetAllAsync();

            return donors.Select(MapToResponseDto);
        }

     
        public async Task<DonorResponseDto?> GetDonorByIdAsync(int id)
        {
            var donor = await _donorRepository.GetByIdAsync(id); 
            return donor != null ? MapToResponseDto(donor) : null;
        }

        public async Task<IEnumerable<DonorResponseDto>> SearchDonorByNameAsync(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return Enumerable.Empty<DonorResponseDto>();
            }

            var prizes = await _donorRepository.SearchByNameAsync(searchTerm);
            return prizes.Select(MapToResponseDto);
        }

        public async Task<DonorResponseDto> CreateDonorAsync(DonorCreateDto createDto)
        {
            var donor = new Donor
            {        
                FirstName = createDto.FirstName,
                LastName = createDto.LastName,
                Email = createDto.Email,
                Phone = createDto.Phone,
                Prizes = new List<Prize>() 
            };

            var createdDonor = await _donorRepository.CreateAsync(donor);

            return MapToResponseDto(createdDonor);
        }
        public async Task<DonorResponseDto?> UpdateDonorAsync(int id, DonorUpdateDto updateDto)
        {
            var existingDonor = await _donorRepository.GetByIdAsync(id);
            if (existingDonor == null) return null;

            if (updateDto.FirstName != null) existingDonor.FirstName = updateDto.FirstName;
            if (updateDto.LastName != null) existingDonor.LastName = updateDto.LastName;
            if (updateDto.Email != null) existingDonor.Email = updateDto.Email;
            if (updateDto.Phone != null) existingDonor.Phone = updateDto.Phone;

            var updatedDonor = await _donorRepository.UpdateAsync(existingDonor);
            return updatedDonor != null ? MapToResponseDto(updatedDonor) : null;
        }
        public async Task<bool> DeleteDonorAsync(int id)
        {
            return await _donorRepository.DeleteAsync(id);
        }
        private static DonorResponseDto MapToResponseDto(Donor donor)
        {
            return new DonorResponseDto
            {
                Id = donor.Id,
                FirstName = donor.FirstName,
                LastName = donor.LastName,
                Email = donor.Email,
                Phone = donor.Phone,
                PrizesNames = donor.Prizes != null
                            ? donor.Prizes.Select(g => g.Name).ToList()
                            : new List<string>()
            };
        }


    }
}






    