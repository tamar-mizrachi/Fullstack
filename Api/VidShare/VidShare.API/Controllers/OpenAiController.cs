using Microsoft.AspNetCore.Mvc;
using VidShare.Core.Services;

namespace VidShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly IOpenAIService _openAIService;

        public AnalyzeController(IOpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        [HttpGet("ping")]
        public IActionResult Ping() =>
            Ok(new { message = "AnalyzeController is working ✅", timestamp = DateTime.Now });

        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeByUrl([FromBody] TranscribeUrlRequest request)
        {
            if (string.IsNullOrEmpty(request.VideoUrl))
                return BadRequest(new { error = "videoUrl is required" });

            try
            {
                var result = await _openAIService.TranscribeFromUrlAsync(request.VideoUrl);
                return Ok(new { transcript = result.Transcript, noSpeech = result.NoSpeech });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("summarize")]
        public async Task<IActionResult> Summarize([FromBody] SummarizeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest(new { error = "Text is empty" });

            var summary = await _openAIService.SummarizeTextAsync(request.Text);
            return Ok(new { summary });
        }
    }

    public class TranscribeUrlRequest
    {
        public string VideoUrl { get; set; } = "";
    }

    public class SummarizeRequest
    {
        public string Text { get; set; } = "";
    }
}