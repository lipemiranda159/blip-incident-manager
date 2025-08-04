using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.ServiceConfigurations;
using Microsoft.Extensions.Configuration;

namespace Blip.IncidentManager.Infrastructure.ExternalServices
{
    public class HuggingFaceSummaryService : IIncidentSummaryAiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiUrl;


        public HuggingFaceSummaryService(HttpClient httpClient, AppConfig appConfig)
        {
            _httpClient = httpClient;
            _apiKey = appConfig.AiConfig.ApiKey;
            _apiUrl = appConfig.AiConfig.ApiUrl;
        }

        public async Task<string> GenerateSummaryAsync(string title, string description, List<string> comments, CancellationToken cancellationToken)
        {
            var textToSummarize = BuildInputText(title, description, comments);

            var payload = new
            {
                inputs = textToSummarize
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync(_apiUrl, content, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(cancellationToken);
                throw new Exception($"Erro ao gerar resumo: {response.StatusCode} - {error}");
            }

            var responseStream = await response.Content.ReadAsStreamAsync(cancellationToken);
            var result = await JsonSerializer.DeserializeAsync<List<SummaryResponse>>(responseStream, cancellationToken: cancellationToken);

            return result?.FirstOrDefault()?.SummaryText ?? string.Empty;
        }

        private string BuildInputText(string title, string description, List<string> comments)
        {
            var combined = new StringBuilder();
            combined.AppendLine($"Título: {title}");
            combined.AppendLine($"Descrição: {description}");

            if (comments?.Any() == true)
            {
                combined.AppendLine("Comentários:");
                foreach (var comment in comments)
                {
                    combined.AppendLine($"- {comment}");
                }
            }

            return combined.ToString();
        }

        private class SummaryResponse
        {
            public string SummaryText { get; set; }
        }
    }
}
