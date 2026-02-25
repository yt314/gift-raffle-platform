using ex1.Dto;

namespace ex1.Interfaces.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync();
        Task<CategoryResponseDto> GetCategoryByIdAsync(int id);

        Task<CategoryResponseDto> AddCategoryAsync(CategoryCreateDto categoryDto);
        
        Task<CategoryResponseDto> UpdateCategoryAsync(int Id, CategoryUpdateDto categoryDto);

       // Task <bool> DeleteCategoryAsync(int id);
    }
}