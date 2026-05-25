using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using VidShare.Core.DTOs;
using VidShare.Core.Models;
using VidShare.Core.Services;

namespace VidShare.Service
{
    public class OpenAIService : IOpenAIService
    {
        private readonly HttpClient _client;
        private readonly string _apiKey;

        public OpenAIService(IHttpClientFactory factory, IOptions<OpenAi> settings)
        {
            _client = factory.CreateClient();
            _apiKey = settings.Value.ApiKey;
        }

        public async Task<VideoTranscriptionResult> TranscribeFromUrlAsync(string videoUrl)
        {
            _client.DefaultRequestHeaders.Clear();

            byte[] videoBytes;
            try
            {
                videoBytes = await _client.GetByteArrayAsync(videoUrl);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to download video: {ex.Message}");
            }

            var uri = new Uri(videoUrl);
            var fileName = Path.GetFileName(uri.LocalPath);
            if (string.IsNullOrEmpty(fileName)) fileName = "video.mp4";

            var extension = Path.GetExtension(fileName).ToLower();
            var allowedExtensions = new[] { ".mp3", ".mp4", ".wav", ".m4a", ".webm" };
            if (!allowedExtensions.Contains(extension))
                fileName = Path.ChangeExtension(fileName, ".mp4");

            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            using var form = new MultipartFormDataContent();
            var fileContent = new ByteArrayContent(videoBytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue("video/mp4");

            form.Add(fileContent, "file", fileName);
            form.Add(new StringContent("whisper-1"), "model");
            form.Add(new StringContent("he"), "language");

            var response = await _client.PostAsync(
                "https://api.openai.com/v1/audio/transcriptions", form);

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Whisper API error: {json}");

            using var doc = JsonDocument.Parse(json);
            var transcript = doc.RootElement.GetProperty("text").GetString() ?? "";

            return new VideoTranscriptionResult
            {
                Transcript = transcript,
                NoSpeech = string.IsNullOrWhiteSpace(transcript)
            };
        }

        public async Task<string> SummarizeTextAsync(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return "⚠️ לא זוהה דיבור — ייתכן שהסרטון מכיל מוזיקה בלבד.";

            _client.DefaultRequestHeaders.Clear();
            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var body = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "system", content = "סכם בצורה ברורה, קצרה ועניינית." },
                    new { role = "user", content = text }
                }
            };

            var response = await _client.PostAsync(
                "https://api.openai.com/v1/chat/completions",
                new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            );

            var jsonResult = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return "❌ שגיאה בקבלת סיכום מה-AI.";

            using var doc = JsonDocument.Parse(jsonResult);
            var message = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return string.IsNullOrWhiteSpace(message)
                ? "⚠️ לא נמצא תוכן מילולי שניתן לסכם."
                : message.Trim();
        }
    }
}