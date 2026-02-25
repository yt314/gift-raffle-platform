using ex1.Dto;
using ex1.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ex1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }


        [HttpGet("getAllCategories")]
        public async Task<ActionResult<IEnumerable<CategoryResponseDto>>> GetAll()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("getById/{id}")]
        [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<CategoryResponseDto>> GetById(int id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);

            if (category == null)
            {
                return NotFound(new { message = $"Category with ID {id} not found." });
            }

            return Ok(category);
        }
       
        [HttpPost("createCategory")]
        [Authorize(Roles = "manager")]
        public async Task<ActionResult<CategoryResponseDto>> Create([FromBody] CategoryCreateDto createDto)
        {
            try
            {
                var category = await _categoryService.AddCategoryAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("updateCategoryById/{id}")]
        [Authorize(Roles = "manager")]

        public async Task<ActionResult<CategoryResponseDto>> Update(int id, [FromBody] CategoryUpdateDto updateDto)
        {
            try
            {
                var category = await _categoryService.UpdateCategoryAsync(id, updateDto);

                if (category == null)
                {
                    return NotFound(new { message = $"Category with ID {id} not found." });
                }

                return Ok(category);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        //[HttpDelete("{id}")]
        //[ProducesResponseType(StatusCodes.Status204NoContent)]
        //[ProducesResponseType(StatusCodes.Status404NotFound)]
        //public async Task<IActionResult> Delete(int id)
        //{
        //    var result = await _categoryService.DeleteCategoryAsync(id);

        //    if (!result)
        //    {
        //        return NotFound(new { message = $"Category with ID {id} not found." });
        //    }

        //    return NoContent();
        //}
    }
}