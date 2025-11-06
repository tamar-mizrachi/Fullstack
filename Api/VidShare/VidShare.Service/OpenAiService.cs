using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using VidShare.Core.Models;

namespace VidShare.Service
{
    public class OpenAIService
    {
        private readonly HttpClient _client;
        private readonly string _apiKey;

        public OpenAIService(IHttpClientFactory factory, IOptions<OpenAi> settings)
        {
            _client = factory.CreateClient();
            _apiKey = settings.Value.ApiKey;
        }

        public async Task<string> SummarizeTextAsync(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return "⚠️ לא זוהה דיבור — ייתכן שהסרטון מכיל מוזיקה בלבד.";

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var body = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new { role = "system", content = "סכם בצורה ברורה, קצרה ועניינית. אם אין תוכן מילולי אמיתי — החזר הודעה על כך." },
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
