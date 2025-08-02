using MediatR;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Blip.IncidentManager.Application.Services;

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

            services.AddValidatorsFromAssembly(typeof(ServiceCollectionsExtensions).Assembly, lifetime: ServiceLifetime.Scoped);
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationPipelineBehaviour<,>));

            return services;
        }
    }
}
