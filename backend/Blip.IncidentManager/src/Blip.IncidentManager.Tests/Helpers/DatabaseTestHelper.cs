using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Blip.IncidentManager.Persistence.Contexts;

namespace Blip.IncidentManager.Tests.Helpers;

/// <summary>
/// Helper para configurar banco de dados em memória para testes
/// </summary>
public static class DatabaseTestHelper
{
    /// <summary>
    /// Cria um contexto de banco de dados em memória para testes
    /// </summary>
    public static IncidentDbContext CreateInMemoryContext(string databaseName = "")
    {
        if (string.IsNullOrEmpty(databaseName))
        {
            databaseName = Guid.NewGuid().ToString();
        }

        var options = new DbContextOptionsBuilder<IncidentDbContext>()
            .UseInMemoryDatabase(databaseName)
            .Options;

        return new IncidentDbContext(options);
    }

    /// <summary>
    /// Configura serviços para testes de integração
    /// </summary>
    public static IServiceCollection AddTestDatabase(this IServiceCollection services, string databaseName = "")
    {
        if (string.IsNullOrEmpty(databaseName))
        {
            databaseName = Guid.NewGuid().ToString();
        }

        services.AddDbContext<IncidentDbContext>(options =>
            options.UseInMemoryDatabase(databaseName));

        return services;
    }

    /// <summary>
    /// Limpa e recria o banco de dados para testes
    /// </summary>
    public static async Task ResetDatabaseAsync(IncidentDbContext context)
    {
        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();
    }

    /// <summary>
    /// Popula o banco com dados de teste
    /// </summary>
    public static async Task SeedTestDataAsync(IncidentDbContext context)
    {
        // Criar usuários de teste
        var users = TestDataBuilder.CreateUserList(3);
        context.Users.AddRange(users);
        await context.SaveChangesAsync();

        // Criar incidentes de teste
        var incidents = TestDataBuilder.CreateIncidentList(5, users.First().Id);
        context.Incidents.AddRange(incidents);
        await context.SaveChangesAsync();

        // Criar comentários de teste
        var comments = new List<Domain.Entities.Comment>();
        foreach (var incident in incidents)
        {
            comments.Add(TestDataBuilder.CreateValidComment(incident.Id, users.First().Id));
        }
        context.Comments.AddRange(comments);
        await context.SaveChangesAsync();
    }
}
