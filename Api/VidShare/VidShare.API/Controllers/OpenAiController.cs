

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace VidShare.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyzeController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly string? _openAIApiKey;

        public AnalyzeController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClient = httpClientFactory.CreateClient("TranscriptionClient");
            _openAIApiKey = config["OpenAI:ApiKey"];
        }

        [HttpGet("ping")]
        public IActionResult Ping()
        {
            return Ok(new
            {
                message = "AnalyzeController is working ✅",
                timestamp = DateTime.Now,
                apiKeyExists = !string.IsNullOrEmpty(_openAIApiKey),
                apiKeyLength = _openAIApiKey?.Length ?? 0
            });
        }

        // ✅ Endpoint חדש - מקבל URL ומוריד את הסרטון לבד
        [HttpPost("transcribe")]
        public async Task<IActionResult> TranscribeByUrl([FromBody] TranscribeUrlRequest request)
        {
            try
            {
                Console.WriteLine("═══════════════════════════════════");
                Console.WriteLine("🎬 NEW TRANSCRIPTION REQUEST (URL)");
                Console.WriteLine($"⏰ Time: {DateTime.Now:HH:mm:ss}");
                Console.WriteLine($"🔗 URL: {request.VideoUrl}");
                Console.WriteLine("═══════════════════════════════════");

                if (string.IsNullOrEmpty(request.VideoUrl))
                {
                    Console.WriteLine("❌ No URL received");
                    return BadRequest(new { error = "videoUrl is required" });
                }

                if (string.IsNullOrEmpty(_openAIApiKey))
                {
                    Console.WriteLine("❌ OpenAI API Key is missing");
                    return StatusCode(500, new { error = "OpenAI API Key not configured" });
                }

                // ✅ הורדת הסרטון מה-URL (S3)
                Console.WriteLine("📥 Downloading video from URL...");
                byte[] videoBytes;
                try
                {
                    videoBytes = await _httpClient.GetByteArrayAsync(request.VideoUrl);
                    Console.WriteLine($"✅ Downloaded {videoBytes.Length / 1024.0 / 1024.0:F2} MB");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"❌ Failed to download video: {ex.Message}");
                    return StatusCode(500, new { error = $"Failed to download video: {ex.Message}" });
                }

                // ✅ קביעת שם קובץ ופורמט
                var uri = new Uri(request.VideoUrl);
                var fileName = Path.GetFileName(uri.LocalPath);
                if (string.IsNullOrEmpty(fileName)) fileName = "video.mp4";

                var extension = Path.GetExtension(fileName).ToLower();
                var allowedExtensions = new[] { ".mp3", ".mp4", ".wav", ".m4a", ".webm" };
                if (!allowedExtensions.Contains(extension))
                {
                    fileName = Path.ChangeExtension(fileName, ".mp4");
                    extension = ".mp4";
                }

                Console.WriteLine($"📦 File Name: {fileName}");
                Console.WriteLine($"🔍 Extension: {extension}");

                // ✅ שליחה ל-OpenAI Whisper
                var apiUrl = "https://api.openai.com/v1/audio/transcriptions";

                using var form = new MultipartFormDataContent();
                var fileContent = new ByteArrayContent(videoBytes);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue("video/mp4");

                form.Add(fileContent, "file", fileName);
                form.Add(new StringContent("whisper-1"), "model");
                form.Add(new StringContent("he"), "language");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", _openAIApiKey);

                Console.WriteLine("📤 Sending to OpenAI Whisper API...");
                var response = await _httpClient.PostAsync(apiUrl, form);
                var json = await response.Content.ReadAsStringAsync();

                Console.WriteLine($"📥 Response Status: {response.StatusCode}");

                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"❌ OpenAI Error: {json}");
                    return StatusCode((int)response.StatusCode, new { error = "OpenAI API Error", details = json });
                }

                using var doc = JsonDocument.Parse(json);
                string transcript = doc.RootElement.GetProperty("text").GetString() ?? "";

                Console.WriteLine($"📝 Transcript Length: {transcript.Length} characters");

                if (string.IsNullOrWhiteSpace(transcript))
                {
                    Console.WriteLine("⚠️ Empty transcript");
                    return Ok(new { transcript = "", noSpeech = true });
                }

                Console.WriteLine("✅ Transcription completed successfully!");
                Console.WriteLine("═══════════════════════════════════");

                return Ok(new { transcript, noSpeech = false });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 EXCEPTION: {ex.Message}");
                return StatusCode(500, new { error = ex.Message, type = ex.GetType().Name });
            }
        }

        // ✅ Endpoint ישן - מקבל קובץ ישירות (נשמר למקרה הצורך)
        [HttpPost("transcribe-file")]
        public async Task<IActionResult> TranscribeFile(IFormFile file)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { error = "File is required" });

                if (string.IsNullOrEmpty(_openAIApiKey))
                    return StatusCode(500, new { error = "OpenAI API Key not configured" });

                var allowedExtensions = new[] { ".mp3", ".mp4", ".wav", ".m4a", ".webm" };
                var extension = Path.GetExtension(file.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { error = $"Invalid file format. Allowed: {string.Join(", ", allowedExtensions)}" });

                var apiUrl = "https://api.openai.com/v1/audio/transcriptions";

                using var form = new MultipartFormDataContent();
                using var fileStream = file.OpenReadStream();
                var streamContent = new StreamContent(fileStream);
                streamContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType ?? "video/mp4");

                form.Add(streamContent, "file", file.FileName);
                form.Add(new StringContent("whisper-1"), "model");
                form.Add(new StringContent("he"), "language");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", _openAIApiKey);

                var response = await _httpClient.PostAsync(apiUrl, form);
                var json = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, new { error = "OpenAI API Error", details = json });

                using var doc = JsonDocument.Parse(json);
                string transcript = doc.RootElement.GetProperty("text").GetString() ?? "";

                if (string.IsNullOrWhiteSpace(transcript))
                    return Ok(new { transcript = "", noSpeech = true });

                return Ok(new { transcript, noSpeech = false });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("test-openai")]
        public async Task<IActionResult> TestOpenAI()
        {
            try
            {
                if (string.IsNullOrEmpty(_openAIApiKey))
                    return BadRequest(new { error = "OpenAI API Key is missing in configuration" });

                var apiUrl = "https://api.openai.com/v1/chat/completions";
                var requestData = new
                {
                    model = "gpt-4o-mini",
                    messages = new[]
                    {
                        new { role = "user", content = "Say 'Test successful' in Hebrew" }
                    }
                };

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", _openAIApiKey);

                var jsonContent = new StringContent(
                    JsonSerializer.Serialize(requestData),
                    Encoding.UTF8,
                    "application/json"
                );

                var response = await _httpClient.PostAsync(apiUrl, jsonContent);
                var responseJson = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    return StatusCode((int)response.StatusCode, new { error = "OpenAI API failed", details = responseJson });

                return Ok(new { success = true, message = "OpenAI connected successfully!", response = responseJson });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("test-upload")]
        public IActionResult TestUpload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "No file uploaded" });

            return Ok(new
            {
                success = true,
                fileName = file.FileName,
                fileSizeMB = file.Length / 1024.0 / 1024.0,
                contentType = file.ContentType,
                message = "File uploaded successfully"
            });
        }

        [HttpPost("summarize")]
        public async Task<IActionResult> Summarize([FromBody] SummarizeRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return BadRequest(new { error = "Text is empty" });

            var apiUrl = "https://api.openai.com/v1/chat/completions";
            var requestData = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "system", content = "Summarize the following text in Hebrew, briefly and clearly." },
                    new { role = "user", content = request.Text }
                }
            };

            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _openAIApiKey);

            var jsonContent = new StringContent(
                JsonSerializer.Serialize(requestData),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(apiUrl, jsonContent);
            var responseJson = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, new { error = responseJson });

            using var doc = JsonDocument.Parse(responseJson);
            string summary = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "";

            return Ok(new { summary });
        }
    }

    // ✅ Model חדש לקבלת URL
    public class TranscribeUrlRequest
    {
        public string VideoUrl { get; set; } = "";
    }

    public class SummarizeRequest
    {
        public string Text { get; set; } = "";
    }
}