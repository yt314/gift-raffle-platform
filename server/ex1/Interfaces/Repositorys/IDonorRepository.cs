using ex1.Models;

namespace ex1.Interfaces.Repositorys
{
    public interface IDonorRepository
    {
        Task<IEnumerable<Donor>> GetAllAsync();
        Task<Donor?> GetByIdAsync(int id);
        Task<IEnumerable<Donor>> SearchByNameAsync(string searchTerm);
        Task<Donor> CreateAsync(Donor donor);
        Task<Donor?> UpdateAsync(Donor donor);
        Task<bool> DeleteAsync(int id);

    }
}
