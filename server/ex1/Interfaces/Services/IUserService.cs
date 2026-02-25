using ex1.Dto;

namespace ex1.Interfaces.Services;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto?> GetUserByIdAsync(int id);
    Task<UserResponseDto> CreateUserAsync(UserCreateDto createDto);
    Task<UserResponseDto?> UpdateUserAsync(int id, UserUpdateDto updateDto);
    Task<bool> DeleteUserAsync(int id);
    Task<LoginResponseDto?> AuthenticateAsync(string email, string password);
}
