using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using VidShare.API.Models;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.Core.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace VidShare.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoController : ControllerBase
    {
        private readonly IVideoService _videoService;
        private readonly IMapper _mapper;
        public VideoController(IVideoService videoService, IMapper mapper)
        {
            _videoService = videoService;
            _mapper = mapper;
        }

        // GET: api/<VideoController>
        [HttpGet]
        public ActionResult Get()
        {
            var list = _videoService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<VideoDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/<VideoController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var list = _videoService.GetById(id);
            var listDTO = _mapper.Map<IEnumerable<VideoDTO>>(list);
            return Ok(listDTO);
        }

        // POST api/<VideoController>
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] VideoPostModel video)
        {
            var newVideo = new Video()
            {
                NameTalk = video.NameTalk,
                CreatedDate = video.CreatedDate,
                Description = video.Description,
                Title = video.Title,
                UploadDate = DateTime.Now,
                VideoUrl = video.VideoUrl,
                transcription = video.transcription
            };
            var videoNew = await _videoService.AddAsync(newVideo);
            return Ok(newVideo);
        }

        // PUT api/<VideoController>/5
        [HttpPut("{id}")]
        public  ActionResult Put(int id, [FromBody] VideoPostModel video)
        {
            var updateVideo = new Video()
            {
                NameTalk = video.NameTalk,
                CreatedDate = video.CreatedDate,
                Description = video.Description,
                Title = video.Title,
                UploadDate = DateTime.Now,
                VideoUrl = video.VideoUrl,
                transcription = video.transcription
            };
            var newVideo = _videoService.AddAsync(updateVideo);
            return Ok(newVideo);
        }

        // DELETE api/<VideoController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var video=_videoService.GetById(id);    
            if(video is null) { return NotFound(); }
            _videoService.Delete(id);
            return Ok("Video deleted successfully");
        }
    }
}
