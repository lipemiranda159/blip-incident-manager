using Blip.IncidentManager.Application._Extensions;
using Blip.IncidentManager.Persistence.Extensions;
using Blip.IncidentManager.ServiceConfigurations.Extensions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace Blip.IncidentManager.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddIncidentManagerApiService(this IServiceCollection services, IConfiguration configuration)
        {
            var config = services.AddServiceConfigurations(configuration);
            services.AddIncidentDbContext(config);
            services.AddIncidentManagerApplications();

            services.AddAutoMapper(cfg => cfg.AddMaps(typeof(ServiceCollectionExtensions).Assembly));

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Incident Manager API",
                    Version = "v1",
                    Description = "API sistema de gerenciamento de chamados"
                });
            });

            return services;
        }
    }
}
