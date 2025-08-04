using FluentAssertions;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Tests.Helpers;

namespace Blip.IncidentManager.Tests.UnitTests.Domain.Entities;

public class IncidentTests : TestBase
{
    [Fact]
    public void Incident_WhenCreated_ShouldHaveValidProperties()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var title = "Test Incident";

        // Act
        var incident = TestDataBuilder.CreateValidIncident(userId, title);

        // Assert
        incident.Should().NotBeNull();
        incident.Id.Should().NotBeEmpty();
        incident.Title.Should().Be(title);
        incident.Description.Should().NotBeNullOrEmpty();
        incident.CreatedById.Should().Be(userId);
        incident.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        incident.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Incident_WithInvalidTitle_ShouldStillCreateButBeInvalid(string invalidTitle)
    {
        // Arrange & Act
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = invalidTitle,
            Description = "Valid Description",
            Status = "Aberto",
            Priority = "Baixa",
            CreatedById = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Assert
        incident.Should().NotBeNull();
        incident.Title.Should().Be(invalidTitle);
    }

    [Fact]
    public void Incident_WithEmptyUserId_ShouldHaveEmptyUserId()
    {
        // Arrange & Act
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = "Test Incident",
            Description = "Test Description",
            Status = "Aberto",
            Priority = "Baixa",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Assert
        incident.CreatedById.Should().Be(Guid.Empty);
    }

    [Theory]
    [InlineData("Aberto")]
    [InlineData("Pendente")]
    [InlineData("Resolvido")]
    [InlineData("Cancelado")]
    public void Incident_WithDifferentStatuses_ShouldSetStatusCorrectly(string status)
    {
        // Arrange & Act
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = "Test Incident",
            Description = "Test Description",
            Status = status,
            Priority = "Baixa",
            CreatedById = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Assert
        incident.Status.Should().Be(status);
    }

    [Theory]
    [InlineData("Baixa")]
    [InlineData("Média")]
    [InlineData("Alta")]
    [InlineData("Critico")]
    public void Incident_WithDifferentPriorities_ShouldSetPriorityCorrectly(string priority)
    {
        // Arrange & Act
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = "Test Incident",
            Description = "Test Description",
            Status = "Aberto",
            Priority = priority,
            CreatedById = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Assert
        incident.Priority.Should().Be(priority);
    }

    [Fact]
    public void Incident_UpdatedAt_ShouldBeAfterOrEqualToCreatedAt()
    {
        // Arrange
        var createdAt = DateTime.UtcNow.AddMinutes(-5);
        var updatedAt = DateTime.UtcNow;

        // Act
        var incident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = "Test Incident",
            Description = "Test Description",
            Status = "Aberto",
            Priority = "Baixa",
            CreatedById = Guid.NewGuid(),
            CreatedAt = createdAt,
            UpdatedAt = updatedAt
        };

        // Assert
        incident.UpdatedAt.Should().BeOnOrAfter(incident.CreatedAt);
    }

    [Fact]
    public void Incident_MultipleIncidents_ShouldHaveUniqueIds()
    {
        // Arrange & Act
        var incidents = TestDataBuilder.CreateIncidentList(5);

        // Assert
        incidents.Should().HaveCount(5);
        incidents.Select(i => i.Id).Should().OnlyHaveUniqueItems();
    }
}
