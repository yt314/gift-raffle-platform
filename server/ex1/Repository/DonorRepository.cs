using Microsoft.EntityFrameworkCore;
using ex1.Data;
using ex1.Models;
using ex1.Interfaces.Repositorys;

namespace ex1.Repository
{
    public class DonorRepository : IDonorRepository
    {

        private readonly StoreContext _context;

        public DonorRepository(StoreContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Donor>> GetAllAsync()
        {
            return await _context.Donors
                                 .Include(d => d.Prizes)
                                 .ToListAsync() ?? new List<Donor>();
        }
        public async Task<Donor?> GetByIdAsync(int id)
        {
            return await _context.Donors.FindAsync(id);
        }
        public async Task<IEnumerable<Donor>> SearchByNameAsync(string searchTerm)
        {
            return await _context.Donors
                .Where(p => (p.FirstName+ " "+p.LastName).Contains(searchTerm))
                .ToListAsync();
        }
      
        public async Task<Donor> CreateAsync(Donor donor)
        {
            _context.Donors.Add(donor);
            await _context.SaveChangesAsync();
            return donor;
        }
        public async Task<Donor?> UpdateAsync(Donor donor)
        { 
            var existing = await _context.Donors.FindAsync(donor.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(donor);

            await _context.SaveChangesAsync();
            return existing;
        }        
        public async Task<bool> DeleteAsync(int id)
        {
            var donor = await _context.Donors.FindAsync(id);
            if (donor == null) return false;

            _context.Donors.Remove(donor);
            await _context.SaveChangesAsync();
            return true;
        }

     
    }
}
