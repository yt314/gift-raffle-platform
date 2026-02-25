using Microsoft.AspNetCore.Mvc;
using ex1.Dto;
using ex1.Interfaces.Services;

namespace ex1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;
    
    public AuthController(
        IUserService userService,
        ILogger<AuthController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginRequestDto loginDto)
    {
        if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }
        
        var result = await _userService.AuthenticateAsync(loginDto.Email, loginDto.Password);
        
        if (result == null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }
        
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserResponseDto>> Register([FromBody] UserCreateDto createDto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(createDto);
            return CreatedAtAction(nameof(Register), new { id = user.Id }, user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
