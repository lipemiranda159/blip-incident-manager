using FluentAssertions;
using Blip.IncidentManager.Tests.Helpers;
using AutoFixture;

namespace Blip.IncidentManager.Tests;

/// <summary>
/// Testes de exemplo e validação da infraestrutura de testes
/// </summary>
public class TestInfrastructureTests : TestBase
{
    [Fact]
    public void TestDataBuilder_CreateValidUser_ShouldReturnValidUser()
    {
        // Arrange & Act
        var user = TestDataBuilder.CreateValidUser("test@example.com", "Test User");

        // Assert
        user.Should().NotBeNull();
        user.Email.Should().Be("test@example.com");
        user.Name.Should().Be("Test User");
        user.Id.Should().NotBeEmpty();
        user.PasswordHash.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void TestDataBuilder_CreateIncidentList_ShouldReturnCorrectCount()
    {
        // Arrange
        var count = 5;
        var userId = Guid.NewGuid();

        // Act
        var incidents = TestDataBuilder.CreateIncidentList(count, userId);

        // Assert
        incidents.Should().HaveCount(count);
        incidents.Should().AllSatisfy(i => i.CreatedById.Should().Be(userId));
        incidents.Select(i => i.Id).Should().OnlyHaveUniqueItems();
    }

    [Fact]
    public void AutoFixture_ShouldGenerateUniqueValues()
    {
        // Arrange & Act
        var value1 = Fixture.Create<string>();
        var value2 = Fixture.Create<string>();
        var guid1 = Fixture.Create<Guid>();
        var guid2 = Fixture.Create<Guid>();

        // Assert
        value1.Should().NotBe(value2);
        guid1.Should().NotBe(guid2);
        guid1.Should().NotBeEmpty();
        guid2.Should().NotBeEmpty();
    }
}
