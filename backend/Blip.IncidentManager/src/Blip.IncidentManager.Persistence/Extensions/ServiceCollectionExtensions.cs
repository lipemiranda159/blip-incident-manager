using Blip.IncidenteManager.ServiceConfigurations;
using Blip.IncidentManager.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Blip.IncidentManager.Persistence.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddIncidentDbContext(this IServiceCollection services, AppConfig config)
        {
            var connectionString = config.Database.ConnectionString;

            services.AddDbContext<IncidentDbContext>(options =>
                options.UseNpgsql(connectionString, npgsqlOptions =>
                {
                    npgsqlOptions.SetPostgresVersion(17, 0);
                }));
            return services;
        }
    }
}
