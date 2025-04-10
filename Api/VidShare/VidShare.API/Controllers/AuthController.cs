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
using VidShare.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VidShare.API.Controllers
{/*
    [Route("api/[controller]")]
    [ApiController]

    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, IUserService userService, IMapper mapper)
        {
            _configuration = configuration;
            _mapper = mapper;
            _userService = userService;
        }

        [HttpPost("login")]
        public  IActionResult LoginAsync([FromBody] LoginModel loginModel)//לעשות ASYNC
        {
            User user =  _userService.GetByLogin(loginModel.Name, loginModel.Password);
            if (user == null )
            {
                return Unauthorized("Invalid email or password.");
            }
            var token = GenerateJwtToken(user);
            return Ok(new {Token=token});
        }
        [HttpPost("register")]
        public IActionResult RegisterAsync([FromBody] UserDTO user)
        {
            User exitingUser= _userService.GetByLogin(user.Name,user.Password);
            if (exitingUser != null)
            {
                return BadRequest("Email already in use.");
            }
            var dto=_mapper.Map<User>(user);
             _userService.AddAsync(dto);

            var token = GenerateJwtToken(dto);
            return Ok(new {Token=token});
        }
        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }*/
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, IUserService userService, IMapper mapper)
        {
            _configuration = configuration;
            _mapper = mapper;
            _userService = userService;
        }
        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // כאן יש לבדוק את שם המשתמש והסיסמה מול מסד הנתונים
            if (model.Name == "Admin" && model.Password == "admin123")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Admin" });
                return Ok(new { Token = token });
            }
          
            else if (model.Name == "Viewer" && model.Password == "viewer123")
            {
                var token = _authService.GenerateJwtToken(model.Name, new[] { "Viewer" });
                return Ok(new { Token = token });
            }

            return Unauthorized();
        }
        [HttpPost("register")]
        public IActionResult RegisterAsync([FromBody] UserDTO user)
        {
            User exitingUser = _userService.GetByLogin(user.Name, user.Password);
            if (exitingUser != null)
            {
                return BadRequest("Email already in use.");
            }
            var dto = _mapper.Map<User>(user);
            _userService.AddAsync(dto);

            var token = GenerateJwtToken(dto);
            return Ok(new { Token = token });
        }
        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }


}