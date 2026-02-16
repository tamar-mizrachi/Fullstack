using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VidShare.API.Models;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.Core.Services;


namespace VidShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, IUserService userService, IMapper mapper, AuthService authService)
        {
            _configuration = configuration;
            _mapper = mapper;
            _userService = userService;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (model.Name == "Admin" && model.Password == "admin123")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Admin" });
                return Ok(new { Token = token, role = "Admin" });
            }

            if (model.Name == "Viewer" && model.Password == "viewer123")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Viewer" });
                return Ok(new { Token = token, role = "Viewer" });
            }

            User user = await _userService.GetByLoginAsync(model.Name, model.Password);
            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            var dbToken = GenerateJwtToken(user);
            return Ok(new { Token = dbToken, role = user.Role });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] UserDTO userDto)
        {
            User existingUser = await _userService.GetByLoginAsync(userDto.Name, userDto.Password);
            if (existingUser != null)
            {
                return BadRequest("User already exists.");
            }

            var user = _mapper.Map<User>(userDto);
            await _userService.AddAsync(user);

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token, role = user.Role });
        }

        private string GenerateJwtToken(User user)
        {
            try
            {
                var claims = new List<Claim>
                {
                    new Claim("userId", user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email ?? ""),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                var secretKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
                var signinCredentials = new SigningCredentials(
                    secretKey, SecurityAlgorithms.HmacSha256);

                var tokenOptions = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    audience: _configuration["Jwt:Audience"],
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(60),
                    signingCredentials: signinCredentials
                );

                return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error generating token: {ex.Message}");
                throw;
            }
        }
    }
}
