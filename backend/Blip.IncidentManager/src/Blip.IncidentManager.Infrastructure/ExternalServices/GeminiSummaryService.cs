using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.ServiceConfigurations;

namespace Blip.IncidentManager.Infrastructure.ExternalServices
{
    public class GeminiSummaryService : IIncidentSummaryAiService
    {
        private const string MEDIA_TYPE = "application/json";
        private readonly HttpClient _httpClient;
        private readonly AppConfig _appConfig;

        public GeminiSummaryService(HttpClient httpClient, AppConfig appConfig)
        {
            _httpClient = httpClient;
            _appConfig = appConfig;
        }

        public async Task<string> GenerateSummaryAsync(string title, string description, List<string> comments, CancellationToken cancellationToken)
        {
            var prompt = BuildPrompt(title, description, comments);

            var request = new
            {
                contents = new[]
                {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            }
            };

            var url = $"{_appConfig.Gemini.ApiUrl}?Key={_appConfig.Gemini.ApiKey}";

            var jsonRequest = JsonSerializer.Serialize(request);
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(jsonRequest, Encoding.UTF8, MEDIA_TYPE)
            };

            var response = await _httpClient.SendAsync(httpRequest, cancellationToken);
            response.EnsureSuccessStatusCode();

            var jsonResponse = await response.Content.ReadAsStringAsync(cancellationToken);
            return ExtractSummaryFromResponse(jsonResponse);
        }

        private string BuildPrompt(string title, string description, List<string> comments)
        {
            var commentsText = string.Join(" ", comments);
            return $"""
            Resuma de forma clara o seguinte ticket de suporte.

            Título: {title}
            Descrição: {description}
            Comentários: {commentsText}

            Geração: Use linguagem simples, clara e explique o que o ticket trata assim como as ações feitas até o momento.
            """;
        }

        private string ExtractSummaryFromResponse(string jsonResponse)
        {
            using var doc = JsonDocument.Parse(jsonResponse);
            return doc.RootElement
                      .GetProperty("candidates")[0]
                      .GetProperty("content")
                      .GetProperty("parts")[0]
                      .GetProperty("text")
                      .GetString();
        }
    }
}
