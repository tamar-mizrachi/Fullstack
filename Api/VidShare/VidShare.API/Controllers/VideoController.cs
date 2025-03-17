using Microsoft.AspNetCore.Mvc;
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
        public VideoController(IVideoService videoService)
        {
            _videoService = videoService;
        }

            // GET: api/<VideoController>
        [HttpGet]
        public ActionResult Get()
        {
            var videos = _videoService.GetAll();
            return Ok(videos);
        }

        // GET api/<VideoController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var videos = _videoService.GetById(id);
            return Ok(videos);
        }

        // POST api/<VideoController>
        [HttpPost]
        public ActionResult Post([FromBody] Video video)
        {
            var newVideo = _videoService.Add(video);
            return Ok(newVideo);
        }

        // PUT api/<VideoController>/5
        [HttpPut("{id}")]
        public ActionResult Put(int id, [FromBody] Video video)
        {
            var updateVideo=_videoService.Update(video);
            return Ok(updateVideo);
        }

        // DELETE api/<VideoController>/5
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            _videoService.Delete(id);
            return Ok("Video deleted successfully");
        }
    }
}
