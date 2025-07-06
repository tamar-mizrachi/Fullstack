//using AutoMapper;
//using Microsoft.AspNetCore.Mvc;
//using VidShare.Core.DTOs;
//using VidShare.Core.Models;
//using VidShare.Core.Services;
//using VidShare.Service;

//// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

//namespace VidShare.API.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class BusinessDetailesController : ControllerBase
//    {
//        private readonly IBusinessDetailesService _businessDetailesService;
//        private readonly IMapper _mapper;
//        public BusinessDetailesController(IBusinessDetailesService businessDetailesService,IMapper mapper)
//        {
//            _businessDetailesService = businessDetailesService;
//            _mapper = mapper;
//        }
//        // GET: api/<BusinessDetailesController>
//        [HttpGet]
//        public async Task<ActionResult> Get()
//        {
//            var list = await _businessDetailesService.GetAllAsync();
//            var listDTO = _mapper.Map <IEnumerable<Business_DetailesDTO>>(list);
//            return Ok(listDTO);
//        }

//        // GET api/<BusinessDetailesController>/5
//        [HttpGet("{id}")]
//        public ActionResult Get(int id)
//        {
//            var list = _businessDetailesService.GetById(id);
//            var listDTO=_mapper.Map<Business_DetailesDTO>(list);
//            return Ok(listDTO);
//        }

//        // POST api/<BusinessDetailesController>
//        [HttpPost]
//        public async Task<ActionResult> Post([FromBody] Business_detailes bd)
//        {
//            var newDb = new Business_detailes()
//            {
//                Name = bd.Name,
//                Email = bd.Email,
//                Address = bd.Address,
//                City = bd.City,
//                Phone = bd.Phone,
//            };
//            var dbNew = await _businessDetailesService.AddAsync(bd);
//            return Ok(dbNew);
//        }

//        // PUT api/<BusinessDetailesController>/5
//        [HttpPut("{id}")]
//        public ActionResult Put(int id, [FromBody] Business_detailes bd)
//        {
//            var updateDb = new Business_detailes()
//            {
//                Name = bd.Name,
//                Email = bd.Email,
//                Address = bd.Address,
//                City = bd.City,
//                Phone = bd.Phone,
//            };
//            return Ok(_businessDetailesService.Update(id, updateDb));
//        }

//        // DELETE api/<BusinessDetailesController>/5
//        [HttpDelete("{id}")]
//        public ActionResult Delete(int id)
//        {
//            var bd = _businessDetailesService.GetById(id);
//            if(bd is null) { return NotFound(); }
//            _businessDetailesService.Delete(bd);
//            return Ok("user deleted successfully");
//        }
//    }
//}
