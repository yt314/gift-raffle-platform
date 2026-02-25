using ex1.Data;
using ex1.Dto;
using ex1.Interfaces.Repositorys;
using ex1.Models;
using Microsoft.EntityFrameworkCore;


namespace ex1.Repository
{
    public class PrizeRepository : IPrizeRepository
    {
        private readonly StoreContext _context;

        public PrizeRepository(StoreContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Prize>> GetAllAsync()
        {
            return await _context.Prizes
                               .ToListAsync() ?? new List<Prize>();
        }

        public async Task<Prize?> GetByIdAsync(int id)
        {
            return await _context.Prizes.FindAsync(id);
        }
        public async Task<IEnumerable<Prize>> SearchByNameAsync(string searchTerm)
        {
            return await _context.Prizes
                .Where(p => p.Name.Contains(searchTerm))
                .Include(p => p.category)
                .ToListAsync();
        }

        public async Task<IEnumerable<Prize>> SearchByDonorNameAsync(string donorName)
        {
            return await _context.Prizes
                .Include(p => p.Donor)
                .Where(p => (p.Donor.FirstName + " " + p.Donor.LastName).Contains(donorName))
                .ToListAsync();
        }

        public async Task<IEnumerable<Prize>> SearchByCountAsync(int count)
        {
            return await _context.Prizes
                            .Where(p => _context.Set<Ticket>().Count(t => t.PrizeId == p.Id) == count)
                            .ToListAsync();
        }

        public async Task<Prize> CreateAsync(Prize prize)
        {
            _context.Prizes.Add(prize);
            await _context.SaveChangesAsync();
            return prize;
        }

        public async Task<Prize?> UpdateAsync(Prize prize)
        {
            var existing = await _context.Prizes.FindAsync(prize.Id);
            if (existing == null) return null;

            _context.Entry(existing).CurrentValues.SetValues(prize);

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var prize = await _context.Prizes.FindAsync(id);
            if (prize == null) return false;

            _context.Prizes.Remove(prize);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<PrizeWithDonorDto>> GetPrizesWithDonorsAsync()
        {
            return await _context.Prizes
                                 .Include(p => p.Donor)
                                 .Select(p => new PrizeWithDonorDto
                                 {
                                     PrizeName = p.Name,
                                     DonorName = p.Donor.FirstName + " " + p.Donor.LastName
                                 })
                                 .ToListAsync();
        }
        public async Task<decimal?> GetTicketPriceByNameAsync(string prizeName)
        {
            var prize = await _context.Prizes.FirstOrDefaultAsync(p => p.Name == prizeName);
            return prize?.TicketPrice;
        }


    }
}
