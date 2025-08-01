using Blip.IncidentManager.Application.Common.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Infrastructure.Persistence.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace Blip.IncidentManager.Infrastructure.Extensions
{
    public static class ServiceCollections
    {
        public static IServiceCollection AddIncidentManagerRepositories(this IServiceCollection services)
        {
            services.AddScoped<IRepository<Incident>, IncidentRepository>();
            return services;
        }
    }
}
