using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ex1.Dto;
using ex1.Interfaces.Services;

namespace ex1.Controllers;

[ApiController]
[Route("api/[controller]")]

public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;
    
    public UsersController(
        IUserService userService,
        ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }
    
    [HttpGet]
    //[Authorize(Roles = "manager")]
    public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<UserResponseDto>> GetById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        
        if (user == null)
        {
            return NotFound(new { message = $"User with ID {id} not found." });
        }
        
        return Ok(user);
    }
    
    [HttpPost]
   
    public async Task<ActionResult<UserResponseDto>> Create([FromBody] UserCreateDto createDto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UserResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserResponseDto>> Update(int id, [FromBody] UserUpdateDto updateDto)
    {
        try
        {
            var user = await _userService.UpdateUserAsync(id, updateDto);
            
            if (user == null)
            {
                return NotFound(new { message = $"User with ID {id} not found." });
            }
            
            return Ok(user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
    
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        
        if (!result)
        {
            return NotFound(new { message = $"User with ID {id} not found." });
        }
        
        return NoContent();
    }
}
