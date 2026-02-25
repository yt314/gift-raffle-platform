using System.ComponentModel.DataAnnotations;

namespace ex1.Dto;

public class UserCreateDto
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    //public string Role { get; set; } = string.Empty;
    
    [Required]
    public string Password { get; set; } = string.Empty;
    //[Required]
    //public string Role { get; set; } = string.Empty;


    [Phone]
    [MaxLength(20)]
    public string Phone { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string Address { get; set; } = string.Empty;
}

public class UserUpdateDto
{
    [MaxLength(100)]
    public string? FirstName { get; set; }
    
    [MaxLength(100)]
    public string? LastName { get; set; }
    
    [EmailAddress]
    [MaxLength(200)]
    public string? Email { get; set; }
    
    [Phone]
    [MaxLength(20)]
    public string? Phone { get; set; }
    
    [MaxLength(500)]
    public string? Address { get; set; }
}

public class UserResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime SignAt { get; set; }
}
