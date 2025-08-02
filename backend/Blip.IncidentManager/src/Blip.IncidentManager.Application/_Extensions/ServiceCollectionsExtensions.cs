using Microsoft.Extensions.DependencyInjection;

namespace Blip.IncidentManager.Application._Extensions
{
    public static class ServiceCollectionsExtensions
    {
        public static IServiceCollection AddIncidentManagerApplications(this IServiceCollection services)
        {
            services.AddMediatR(config =>
            {
                config.RegisterServicesFromAssemblies(typeof(ServiceCollectionsExtensions).Assembly);
            });


            return services;
        }
    }
}
