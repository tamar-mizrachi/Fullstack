/*using Microsoft.AspNetCore.Mvc;
using VidShare.Service;

namespace VidShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly OpenAIService _openAIService;

        public AnalyzeController(OpenAIService openAIService)
        {
            _openAIService = openAIService;
        }

        [HttpPost("summarize")]
        public async Task<IActionResult> Summarize([FromBody] string transcript)
        {
            if (string.IsNullOrWhiteSpace(transcript))
                return BadRequest("Text is empty");

            var summary = await _openAIService.SummarizeTextAsync(transcript);
            return Ok(new { summary });
        }
    }
}
*/

using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AnalyzeController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost("transcribe")]
        public async Task<IActionResult> Transcribe([FromBody] TranscribeRequest request)
        {
            if (string.IsNullOrEmpty(request.VideoUrl))
            {
                return BadRequest(new { error = "VideoUrl is required" });
            }

            // כאן יש להחליף ל-URL האמיתי של ה-API שלך לתמלול
            string openAiApiUrl = "https://api.openai.com/v1/audio/transcriptions";

            var requestData = new
            {
                // במידה ואתה שולח קובץ או URL לפי API – תתאים את זה
                file = request.VideoUrl,
                model = "whisper-1"
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestData), Encoding.UTF8, "application/json");

            // הוסף כותרות רלוונטיות (מפתח API וכו')
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer sk-xxx"); // החלף למפתח שלך

            HttpResponseMessage response;
            try
            {
                response = await _httpClient.PostAsync(openAiApiUrl, jsonContent);
            }
            catch (HttpRequestException e)
            {
                return StatusCode(500, new { error = "Error calling transcription API", details = e.Message });
            }

            if (!response.IsSuccessStatusCode)
            {
                var errBody = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, new { error = "Transcription API error", details = errBody });
            }

            var resultJson = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(resultJson);

            if (doc.RootElement.TryGetProperty("text", out var textElement))
            {
                var transcript = textElement.GetString();

                if (string.IsNullOrWhiteSpace(transcript))
                {
                    // אין דיבור (רק מנגינה או שקט)
                    return Ok(new { transcript = "", message = "no_speech_detected" });
                }

                return Ok(new { transcript });
            }
            else
            {
                // לא התקבל טקסט בתגובה מה-API
                return Ok(new { transcript = "", message = "no_text_returned" });
            }
        }
    }

    public class TranscribeRequest
    {
        public string VideoUrl { get; set; }
    }
}
