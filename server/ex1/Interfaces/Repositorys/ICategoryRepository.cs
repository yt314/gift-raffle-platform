using ex1.Models;

namespace ex1.Interfaces.Repositorys
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category> GetByIdAsync(int id);
        Task<Category> AddAsync(Category category);
        Task<Category> UpdateAsync(Category category);
        //Task <bool> DeleteAsync(int id);
    }
}