using ex1.Data;
using ex1.Interfaces.Repositorys;
using ex1.Models;
using Microsoft.EntityFrameworkCore;
using System.Drawing;

namespace ex1.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly StoreContext _context;

        public CategoryRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<Category> AddAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<Category> UpdateAsync(Category category)
        {
            var existing = await _context.Categories.FindAsync(category.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(category);

            await _context.SaveChangesAsync();
            return existing;
        }

        //public async Task<bool> DeleteAsync(int id)
        //{
        //    var category = await _context.Categories.FindAsync(id);
        //    if (category == null) return false;

        //    _context.Categories.Remove(category);
        //    await _context.SaveChangesAsync();
        //    return true;
        //}
    }
}