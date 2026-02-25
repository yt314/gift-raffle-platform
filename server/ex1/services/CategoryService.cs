
using ex1.Dto;
using ex1.Interfaces.Repositorys;
using ex1.Interfaces.Services;
using ex1.Models;
using ex1.Repository;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Drawing;

namespace ex1.services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<CategoryResponseDto>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(MapToDto);
        }
        public async Task<CategoryResponseDto?> GetCategoryByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category != null ? MapToDto(category) : null;
        }
        public async Task<CategoryResponseDto> AddCategoryAsync(CategoryCreateDto categoryDto)
        {
            var category = new Category
            {
                Name = categoryDto.Name
            };
            var createdCategory = await _categoryRepository.AddAsync(category);
           return MapToDto(createdCategory);
        
        }
    
            
        public async Task <CategoryResponseDto?> UpdateCategoryAsync(int id, CategoryUpdateDto categoryDto)
        {
            var existingCategory = await _categoryRepository.GetByIdAsync(id);
            if (existingCategory == null) return null;

            if (categoryDto.Name != null) existingCategory.Name = categoryDto.Name;
            var updatedCategory = await _categoryRepository.UpdateAsync(existingCategory);
            return updatedCategory != null ? MapToDto(updatedCategory) : null;
        }

            //public async Task<bool> DeleteCategoryAsync(int id)
            //{
            //   return  await _categoryRepository.DeleteAsync(id);
            //}

             private static CategoryResponseDto MapToDto(Category category)
            {
            return new CategoryResponseDto
            {
                Id = category.Id,
                Name = category.Name
            };
        }
    }
}