using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _CategoryService;
        private readonly IMapper _mapper;
        public CategoryController(ICategoryService CategoryService,IMapper mapper)
        {
            _CategoryService = CategoryService;
            _mapper= mapper;
        }
        // GET: api/<CategoryController>
        [HttpGet]
        public async Task<ActionResult> GetAsync()
        {
            var list =await _CategoryService.GetAllAsync();
            var listDTO = _mapper.Map<List<CategoryDTO>>(list); 
            return Ok(listDTO);
        }

        // GET api/<CategoryController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var category =await _CategoryService.GetByIdAsync(id);
            var categoryDTO=_mapper.Map<CategoryDTO>(category);
            return Ok(categoryDTO);
        }

        // POST api/<CategoryController>
        [HttpPost]
        public async Task< ActionResult> Post([FromBody] CategoryPostModel category )
        {
            var newCategory = new Category()
            {
                Name = category.Name,
            };
            var CategoryNew=await _CategoryService.AddAsync(newCategory);
            return Ok(CategoryNew);
        }

        // PUT api/<CategoryController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] CategoryPostModel category)
        {
            var newCategory = new Category()
            {
                Name = category.Name,
            };
            return Ok(await _CategoryService.UpdateAsync(newCategory));
        }
        
        // DELETE api/<CategoryController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var del =await _CategoryService.GetByIdAsync(id);
            if (del is null) { return NotFound(); }
            await _CategoryService.DeleteAsync(id);
            return Ok("user deleted successfully");
        }

    }
}
