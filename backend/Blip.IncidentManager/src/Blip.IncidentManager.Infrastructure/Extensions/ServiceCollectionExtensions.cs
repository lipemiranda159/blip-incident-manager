using System.Net.Http.Headers;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Interfaces;
using Blip.IncidentManager.Infrastructure.ExternalServices;
using Blip.IncidentManager.ServiceConfigurations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Blip.IncidentManager.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddIncidentManagerInfrastructure(this IServiceCollection services, AppConfig appConfig)
        {
            services.AddSingleton<IJwtTokenGeneratorService, JwtTokenGeneratorService>();
            services.AddHttpClient<IIncidentSummaryAiService, HuggingFaceSummaryService>();
            services.AddScoped<IPasswordHasher, IdentityPasswordHasher>();
            return services;
        }
    }
}
