using Microsoft.EntityFrameworkCore;
using ex1.Data;
using ex1.Models;
using ex1.Interfaces.Repositorys;

namespace ex1.Repository;

public class UserRepository : IUserRepository
{
    private readonly StoreContext _context;
    
    public UserRepository(StoreContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users.ToListAsync();
    }
    
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            //.Include(u => u.Tickets)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
    
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }
    
    public async Task<User> CreateAsync(User user)
    {
        user.SignAt = DateTime.Now;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }
    
    public async Task<User?> UpdateAsync(User user)
    {
        var existing = await _context.Users.FindAsync(user.Id);
        if (existing == null) return null;
        
        _context.Entry(existing).CurrentValues.SetValues(user);
        user.UpdatedAt = DateTime.Now;
        
        await _context.SaveChangesAsync();
        return existing;
    }
    
    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null) return false;
        
        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
    
    public async Task<bool> ExistsAsync(int id)
    {
        return await _context.Users.AnyAsync(u => u.Id == id);
    }
    
    public async Task<bool> EmailExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }
}
