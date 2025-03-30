﻿using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;
using VidShare.API.Models;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.Core.Services;
using VidShare.Service;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VidShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;
        public UserController(IUserService userService,IMapper mapper)
        {
            _userService = userService;
            _mapper=mapper;
        }

        // GET: api/<UsersController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list=await _userService.GetAllAsync();
            var listDTO=_mapper.Map<IEnumerable<UserDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<UsersController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var user= _userService.GetById(id);
            var userDTO= _mapper.Map<UserDTO>(user);   
            return Ok(userDTO);
        }

        // POST api/<UsersController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserPostModel user)
        {
            var newUser = new User()
            {
                  Name = user.Name,
                  Email = user.Email,
                  Password = user.Password,
                  Role = user.Role, 
            };
            var UserNew=await _userService.AddAsync(newUser);
            return Ok(UserNew);
        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] UserPostModel user)
        {
            var updateUser = new User()
            {
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                Role = user.Role,
            };
            return Ok(_userService.Update(updateUser));
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var user = _userService.GetById(id);
            if(user is null) { return NotFound(); }
            _userService.Delete(id);
            return Ok("user deleted successfully");    
        }
    }
}
