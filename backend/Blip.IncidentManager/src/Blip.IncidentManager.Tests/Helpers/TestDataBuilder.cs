using AutoFixture;
using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Tests.Helpers;

/// <summary>
/// Builder para criar dados de teste consistentes
/// </summary>
public static class TestDataBuilder
{
    private static readonly IFixture _fixture = new Fixture();

    static TestDataBuilder()
    {
        _fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(b => _fixture.Behaviors.Remove(b));
        _fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    /// <summary>
    /// Cria um usuário válido para testes
    /// </summary>
    public static User CreateValidUser(string? email = null, string? name = null)
    {
        return new User
        {
            Id = Guid.NewGuid(),
            Email = email ?? _fixture.Create<string>() + "@test.com",
            Name = name ?? _fixture.Create<string>(),
            PasswordHash = _fixture.Create<string>(),
            Type = "atendente"
        };
    }

    /// <summary>
    /// Cria um incidente válido para testes
    /// </summary>
    public static Incident CreateValidIncident(Guid? userId = null, string? title = null)
    {
        return new Incident
        {
            Id = Guid.NewGuid(),
            Title = title ?? _fixture.Create<string>(),
            Description = _fixture.Create<string>(),
            Status = _fixture.Create<string>(),
            Priority = _fixture.Create<string>(),
            CreatedById = userId ?? Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }

    /// <summary>
    /// Cria um comentário válido para testes
    /// </summary>
    public static Comment CreateValidComment(Guid? incidentId = null, Guid? userId = null)
    {
        return new Comment
        {
            Id = Guid.NewGuid(),
            Content = _fixture.Create<string>(),
            IncidentId = incidentId ?? Guid.NewGuid(),
            AuthorId = userId ?? Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
        };
    }

    /// <summary>
    /// Cria uma lista de incidentes para testes
    /// </summary>
    public static List<Incident> CreateIncidentList(int count = 3, Guid? userId = null)
    {
        var incidents = new List<Incident>();
        for (int i = 0; i < count; i++)
        {
            incidents.Add(CreateValidIncident(userId));
        }
        return incidents;
    }

    /// <summary>
    /// Cria uma lista de usuários para testes
    /// </summary>
    public static List<User> CreateUserList(int count = 3)
    {
        var users = new List<User>();
        for (int i = 0; i < count; i++)
        {
            users.Add(CreateValidUser());
        }
        return users;
    }
}
