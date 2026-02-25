using ex1.Dto;
using ex1.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace ex1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrizeController : ControllerBase
    {
        private readonly IPrizeService _prizeService;

        public PrizeController(IPrizeService prizeService)
        {
            _prizeService = prizeService;
        }

        [HttpGet("getAllPrizes")]
        public async Task<ActionResult<IEnumerable<PrizeResponseDto>>> GetAll()
        {
            var prizes = await _prizeService.GetAllPrizesAsync();
            return Ok(prizes);
        }
        [HttpGet("getPrizeById/{id}")]
        public async Task<ActionResult<PrizeResponseDto>> GetById(int id)
        {
            var prize = await _prizeService.GetPrizeByIdAsync(id);
            if (prize == null)
            {
                return NotFound();
            }
            return Ok(prize);
        }

        [HttpGet("searchPrizeByName")]
        public async Task<ActionResult<IEnumerable<PrizeResponseDto>>> SearchByName([FromQuery] string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                return BadRequest(new { message = "Search term cannot be empty." });
            }

            var prizes = await _prizeService.SearchPrizeByNameAsync(name);
            return Ok(prizes);
        }

        [HttpGet("searchPrizeByDonorName")]
        public async Task<ActionResult<IEnumerable<PrizeResponseDto>>> SearchByDonorName([FromQuery] string donorName)
        {
            if (string.IsNullOrWhiteSpace(donorName))
            {
                return BadRequest(new { message = "Donor name cannot be empty." });
            }

            var prizes = await _prizeService.SearchPrizeByDonorNameAsync(donorName);
            return Ok(prizes);
        }

        [HttpGet("searchPrizeByCount")]
        public async Task<ActionResult<IEnumerable<PrizeResponseDto>>> searchPrizeByCount([FromQuery] int count)
        {
            if (count < 0)
            {
                return BadRequest(new { message = "The number of buyers cannot be less than 0." });
            }

            var prizes = await _prizeService.searchPrizeByCountAsync(count);
            return Ok(prizes);
        }

        [HttpGet("getPrizesWithDonors")]
        public async Task<ActionResult<IEnumerable<PrizeWithDonorDto>>> GetPrizesWithDonors()
        {
            var prizesWithDonors = await _prizeService.GetPrizesWithDonorsAsync();
            if (prizesWithDonors == null)
            {
                return NotFound(new { message = "No prizes with donors found." });
            }
            return Ok(prizesWithDonors);
        }

        [HttpGet("getTicketPriceByName/{prizeName}")]
        public async Task<ActionResult<decimal>> GetTicketPriceByName(string prizeName)
        {
            if (string.IsNullOrWhiteSpace(prizeName))
            {
                return BadRequest(new { message = "Prize name cannot be empty." });
            }

            var ticketPrice = await _prizeService.GetTicketPriceByNameAsync(prizeName);

            if (ticketPrice == null)
            {
                return NotFound(new { message = $"Prize with name '{prizeName}' not found." });
            }

            return Ok(ticketPrice);
        }

        [HttpPost("createNewPrize")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<PrizeResponseDto>> Create([FromBody] PrizeCreateDto createDto)
        {
            try
            {
                var donor = await _prizeService.CreatePrizeAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = donor.Id }, donor);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("updatePrizeById/{id}")]
        [Authorize(Roles = "manager")]

        public async Task<ActionResult<PrizeResponseDto>> Update(int id, [FromBody] PrizeUpdateDto updateDto)
        {
            try
            {
                var prize = await _prizeService.UpdatePrizeAsync(id, updateDto);

                if (prize == null)
                {
                    return NotFound(new { message = $"Prize with ID {id} not found." });
                }

                return Ok(prize);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("deletePrizeById/{id}")]
        [Authorize(Roles = "manager")]

        public async Task<IActionResult> Delete(int id)
        {
            var result = await _prizeService.DeletePrizeAsync(id);

            if (!result)
            {
                return NotFound(new { message = $"Prize with ID {id} not found." });
            }

            return NoContent();
        }

    }
}
