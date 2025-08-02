using Blip.IncidentManager.ServiceConfigurations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Blip.IncidentManager.ServiceConfigurations.Extensions
{
    public static class ServiceCollectionExtensions
    {
        private const string KEY = "IncidentManager";

        public static AppConfig AddServiceConfigurations(this IServiceCollection services, IConfiguration configuration)
        {

            var config = configuration.GetSection(KEY)
                .Get<AppConfig>() ?? new AppConfig();
            services.AddSingleton(config);
            return config;

        }
    }
}
