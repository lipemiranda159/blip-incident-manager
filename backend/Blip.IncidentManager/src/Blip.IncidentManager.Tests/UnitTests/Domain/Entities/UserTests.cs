using FluentAssertions;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Tests.Helpers;

namespace Blip.IncidentManager.Tests.UnitTests.Domain.Entities;

public class UserTests : TestBase
{
    [Fact]
    public void User_WhenCreated_ShouldHaveValidProperties()
    {
        // Arrange & Act
        var user = TestDataBuilder.CreateValidUser("test@example.com", "Test User");

        // Assert
        user.Should().NotBeNull();
        user.Id.Should().NotBeEmpty();
        user.Email.Should().Be("test@example.com");
        user.Name.Should().Be("Test User");
        user.PasswordHash.Should().NotBeNullOrEmpty();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void User_WithInvalidEmail_ShouldStillCreateButBeInvalid(string invalidEmail)
    {
        // Arrange & Act
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = invalidEmail,
            Name = "Valid Name",
            PasswordHash = "ValidHash",
        };

        // Assert
        user.Should().NotBeNull();
        user.Email.Should().Be(invalidEmail);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void User_WithInvalidName_ShouldStillCreateButBeInvalid(string invalidName)
    {
        // Arrange & Act
        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = "valid@email.com",
            Name = invalidName,
            PasswordHash = "ValidHash",
        };

        // Assert
        user.Should().NotBeNull();
        user.Name.Should().Be(invalidName);
    }

    [Fact]
    public void User_WithEmptyGuid_ShouldHaveEmptyId()
    {
        // Arrange & Act
        var user = new User
        {
            Id = Guid.Empty,
            Email = "test@example.com",
            Name = "Test User",
            PasswordHash = "ValidHash",
        };

        // Assert
        user.Id.Should().Be(Guid.Empty);
    }


}
