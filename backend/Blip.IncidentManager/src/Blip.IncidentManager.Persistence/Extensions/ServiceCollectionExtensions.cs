using Blip.IncidentManager.Application.Common.Interfaces;
using Blip.IncidentManager.Persistence.Contexts;
using Blip.IncidentManager.ServiceConfigurations;
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
                }).UseSnakeCaseNamingConvention());

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}
