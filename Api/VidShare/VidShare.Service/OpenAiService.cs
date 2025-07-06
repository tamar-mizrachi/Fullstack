using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using VidShare.Core.Models;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.Extensions.Options;

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
            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var body = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
                    new { role = "system", content = "סכם בקצרה תוכן של סרטון" },
                    new { role = "user", content = text }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

            var response = await _client.PostAsync("https://api.openai.com/v1/chat/completions", content);
            var responseString = await response.Content.ReadAsStringAsync();

            using var jsonDoc = JsonDocument.Parse(responseString);
            var root = jsonDoc.RootElement;

            return root.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString();
        }
    }
}
