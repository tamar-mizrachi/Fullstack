
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VidShare.API.Models;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.Core.Services;

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

        // GET: api/Video
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _videoService.GetAllAsync();
            var listDTO = _mapper.Map<IEnumerable<VideoDTO>>(list);
            return Ok(listDTO);
        }

        // GET api/Video/5
        [HttpGet("{id}")]
        public  async Task<ActionResult> Get(int id)
        {
            var video =await  _videoService.GetByIdAsync(id);
            if (video == null)
                return NotFound();

            var videoDTO = _mapper.Map<VideoDTO>(video);
            return Ok(videoDTO);
        }
        /*
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetVideosByUserId(int userId)
        {
            var videos = await _videoService.GetByUserIdAsync(userId);
            Console.WriteLine($"Type of videos: {videos?.GetType().Name}");
            // בדיקה נכונה יותר
            if (videos == null)
                return NotFound($"No videos found for user with ID {userId}");

            var videoDTOs = _mapper.Map<IEnumerable<VideoDTO>>(videos);
            return Ok(videoDTOs);
        }*/
        [HttpGet("user/{userId}")]
        /*
        public async Task<ActionResult> GetVideosByUserId(int userId)
        {
            var videos = await _videoService.GetByUserIdAsync(userId);

            // הוסף דיבוג לפני המיפוי
            Console.WriteLine($"Type: {videos?.GetType().FullName}");
            Console.WriteLine($"Is IEnumerable: {videos is IEnumerable<Video>}");

            if (videos == null)
                return NotFound($"No videos found for user with ID {userId} Type: {videos?.GetType().FullName} Is IEnumerable: {videos is IEnumerable<Video>}");

            // נסה ככה:
           // var videosList = videos.ToList(); // וודא שזה List
            var videoDTOs = _mapper.Map<List<VideoDTO>>(videos);

            return Ok(videoDTOs);
        }*/

        public async Task<ActionResult> GetVideosByUserId(int userId)
        {
            Console.WriteLine($"Received request for userId: {userId}");

            try
            {
                Console.WriteLine("Calling video service...");
                var videos = await _videoService.GetByUserIdAsync(userId);
                Console.WriteLine($"Type of videos: {videos?.GetType().Name}");
                Console.WriteLine($"Is videos a list? {videos is IEnumerable<Video>}");

                if (videos == null )
                {
                    Console.WriteLine("No videos found");
                    return Ok(new List<VideoDTO>()); // החזר רשימה ריקה במקום NotFound
                }

                Console.WriteLine("Starting mapping...");
                var videoDTOs = _mapper.Map<List<VideoDTO>>(videos);
                Console.WriteLine("Mapping completed successfully");

                return Ok(videoDTOs);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception occurred: {ex}");
                return StatusCode(500, new { error = ex.Message, details = ex.ToString() });
            }
        }
        // POST api/Video
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] VideoPostModel video)
        {
            var newVideo = _mapper.Map<Video>(video);
            newVideo.UploadDate = DateTime.Now;

            var videoCreated = await _videoService.AddAsync(newVideo);
            var videoDTO = _mapper.Map<VideoDTO>(videoCreated);
            return Ok(videoDTO);
        }

        //// PUT api/Video/5
        //[HttpPut("{id}")]
        //public async Task<ActionResult> Put(int id, [FromBody] VideoPostModel video)
        //{
        //    var existingVideo =await  _videoService.GetByIdAsync(id);
        //    if (existingVideo == null)
        //        return NotFound();

        //    // עדכון שדות
        //    existingVideo.NameTalk = video.NameTalk;
        //    existingVideo.CreatedDate = video.CreatedDate;
        //    existingVideo.Description = video.Description;
        //    existingVideo.Title = video.Title;
        //    existingVideo.UploadDate = DateTime.Now;
        //   // existingVideo.VideoUrl = video.VideoUrl;
        //    //existingVideo.CategoryId = video.CategoryId;


        //    await _videoService.UpdateAsync(existingVideo);
        //    var updatedDTO = _mapper.Map<VideoDTO>(existingVideo);
        //    return Ok(updatedDTO);
        //}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] VideoPutModel video)
        {
            var existingVideo = await _videoService.GetByIdAsync(id);
            if (existingVideo == null)
                return NotFound();

            if (!string.IsNullOrWhiteSpace(video.Title))
                existingVideo.Title = video.Title;

            if (!string.IsNullOrWhiteSpace(video.Description))
                existingVideo.Description = video.Description;

            if (!string.IsNullOrWhiteSpace(video.NameTalk))
                existingVideo.NameTalk = video.NameTalk;

            if (video.CreatedDate.HasValue)
                existingVideo.CreatedDate = video.CreatedDate.Value;

            existingVideo.UploadDate = DateTime.Now;

            await _videoService.UpdateAsync(existingVideo);
            var updatedDTO = _mapper.Map<VideoDTO>(existingVideo);
            return Ok(updatedDTO);
        }



        // DELETE api/Video/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var video =await _videoService.GetByIdAsync(id);
            if (video == null)
            {
                return NotFound();
            }
           await _videoService.DeleteAsync(id);
            return Ok("Video deleted successfully");
        }
        

    }
}

