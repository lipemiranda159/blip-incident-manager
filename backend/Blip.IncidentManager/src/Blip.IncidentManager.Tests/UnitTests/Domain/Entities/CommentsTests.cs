using FluentAssertions;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Tests.Helpers;

namespace Blip.IncidentManager.Tests.UnitTests.Domain.Entities;

public class CommentsTests : TestBase
{
    [Fact]
    public void Comments_WhenCreated_ShouldHaveValidProperties()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        // Act
        var comment = TestDataBuilder.CreateValidComment(incidentId, userId);

        // Assert
        comment.Should().NotBeNull();
        comment.Id.Should().NotBeEmpty();
        comment.Content.Should().NotBeNullOrEmpty();
        comment.IncidentId.Should().Be(incidentId);
        comment.AuthorId.Should().Be(userId);
        comment.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Comments_WithInvalidContent_ShouldStillCreateButBeInvalid(string invalidContent)
    {
        // Arrange & Act
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = invalidContent,
            IncidentId = Guid.NewGuid(),
            AuthorId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        comment.Should().NotBeNull();
        comment.Content.Should().Be(invalidContent);
    }

    [Fact]
    public void Comments_WithEmptyIncidentId_ShouldHaveEmptyIncidentId()
    {
        // Arrange & Act
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = "Valid Content",
            IncidentId = Guid.Empty,
            AuthorId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        comment.IncidentId.Should().Be(Guid.Empty);
    }

    [Fact]
    public void Comments_WithEmptyUserId_ShouldHaveEmptyUserId()
    {
        // Arrange & Act
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = "Valid Content",
            IncidentId = Guid.NewGuid(),
            AuthorId = Guid.Empty,
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        comment.AuthorId.Should().Be(Guid.Empty);
    }

    [Fact]
    public void Comments_WithLongContent_ShouldAcceptLongStrings()
    {
        // Arrange
        var longContent = new string('A', 1000);

        // Act
        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = longContent,
            IncidentId = Guid.NewGuid(),
            AuthorId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow
        };

        // Assert
        comment.Content.Should().Be(longContent);
        comment.Content.Length.Should().Be(1000);
    }

    [Fact]
    public void Comments_MultipleComments_ShouldHaveUniqueIds()
    {
        // Arrange
        var incidentId = Guid.NewGuid();
        var userId = Guid.NewGuid();

        // Act
        var comments = new List<Comment>();
        for (int i = 0; i < 5; i++)
        {
            comments.Add(TestDataBuilder.CreateValidComment(incidentId, userId));
        }

        // Assert
        comments.Should().HaveCount(5);
        comments.Select(c => c.Id).Should().OnlyHaveUniqueItems();
        comments.Should().AllSatisfy(c =>
        {
            c.IncidentId.Should().Be(incidentId);
            c.AuthorId.Should().Be(userId);
        });
    }
}
