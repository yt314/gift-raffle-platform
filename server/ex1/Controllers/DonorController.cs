using ex1.Dto;
using ex1.Interfaces.Services;
using ex1.Models;
using ex1.services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ex1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "manager")]
    public class DonorController : ControllerBase
    {
        private readonly IDonorService _donorService;

        public DonorController(IDonorService donorService)
        {
            _donorService = donorService;
        }


        [HttpGet()]
        public async Task<ActionResult<IEnumerable<DonorResponseDto>>> GetAll()
        {
            var donors = await _donorService.GetAllDonorsAsync();
            return Ok(donors);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<DonorResponseDto>> GetById(int id)
        {
            var donor = await _donorService.GetDonorByIdAsync(id);

            if (donor == null)
            {
                return NotFound(new { message = $"Donor with ID {id} not found." });
            }

            return Ok(donor);
        }
        [HttpGet("searchDonorByFullName")]
        public async Task<ActionResult<IEnumerable<DonorResponseDto>>> SearchByName([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Search term cannot be empty." });
            }

            var donor = await _donorService.SearchDonorByNameAsync(name);
            return Ok(donor);
        }
      
        [HttpPost()]
        public async Task<ActionResult<DonorResponseDto>> Create([FromBody] DonorCreateDto createDto)
        {
            try
            {
                var donor = await _donorService.CreateDonorAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = donor.Id }, donor);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<DonorResponseDto>> Update(int id, [FromBody] DonorUpdateDto updateDto)
        {
            try
            {
                var donor = await _donorService.UpdateDonorAsync(id, updateDto);

                if (donor == null)
                {
                    return NotFound(new { message = $"Donor with ID {id} not found." });
                }

                return Ok(donor);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _donorService.DeleteDonorAsync(id);

            if (!result)
            {
                return NotFound(new { message = $"Donor with ID {id} not found." });
            }

            return NoContent();
        }
    }
}


