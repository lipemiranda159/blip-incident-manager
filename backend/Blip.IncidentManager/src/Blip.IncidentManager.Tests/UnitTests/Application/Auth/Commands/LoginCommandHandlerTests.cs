using FluentAssertions;
using Moq;
using Microsoft.Extensions.Logging;
using Blip.IncidentManager.Application.Auth.Commands.Login;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Tests.Helpers;

namespace Blip.IncidentManager.Tests.UnitTests.Application.Auth.Commands;

public class LoginCommandHandlerTests : TestBase
{
    private readonly Mock<ILogger<LoginCommandHandler>> _mockLogger;
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IPasswordHasher> _mockPasswordHasher;
    private readonly Mock<IJwtTokenGeneratorService> _mockJwtTokenGenerator;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly LoginCommandHandler _handler;

    public LoginCommandHandlerTests()
    {
        _mockLogger = new Mock<ILogger<LoginCommandHandler>>();
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockPasswordHasher = new Mock<IPasswordHasher>();
        _mockJwtTokenGenerator = new Mock<IJwtTokenGeneratorService>();
        _mockUserRepository = new Mock<IUserRepository>();

        _mockUnitOfWork.Setup(x => x.GetUsers()).Returns(_mockUserRepository.Object);

        _handler = new LoginCommandHandler(
            _mockLogger.Object,
            _mockUnitOfWork.Object,
            _mockPasswordHasher.Object,
            _mockJwtTokenGenerator.Object);
    }

    [Fact]
    public async Task Handle_WithValidCredentials_ShouldReturnToken()
    {
        // Arrange
        var user = TestDataBuilder.CreateValidUser("test@example.com", "Test User");
        var command = new LoginCommand { Email = "test@example.com", Password = "password123" };
        var expectedToken = "jwt-token-123";

        _mockUserRepository.Setup(x => x.GetUserByEmailAsync(command.Email))
            .ReturnsAsync(user);
        _mockPasswordHasher.Setup(x => x.Verify(command.Password, user.PasswordHash))
            .Returns(true);
        _mockJwtTokenGenerator.Setup(x => x.GenerateToken(user))
            .Returns(expectedToken);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().Be(expectedToken);
        _mockUserRepository.Verify(x => x.GetUserByEmailAsync(command.Email), Times.Once);
        _mockPasswordHasher.Verify(x => x.Verify(command.Password, user.PasswordHash), Times.Once);
        _mockJwtTokenGenerator.Verify(x => x.GenerateToken(user), Times.Once);
    }

    [Fact]
    public async Task Handle_WithInvalidPassword_ShouldThrowUnauthorizedAccessException()
    {
        // Arrange
        var user = TestDataBuilder.CreateValidUser("test@example.com", "Test User");
        var command = new LoginCommand { Email = "test@example.com", Password = "wrongpassword" };

        _mockUserRepository.Setup(x => x.GetUserByEmailAsync(command.Email))
            .ReturnsAsync(user);
        _mockPasswordHasher.Setup(x => x.Verify(command.Password, user.PasswordHash))
            .Returns(false);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => _handler.Handle(command, CancellationToken.None));

        exception.Message.Should().Be("Invalid email or password.");
        _mockUserRepository.Verify(x => x.GetUserByEmailAsync(command.Email), Times.Once);
        _mockPasswordHasher.Verify(x => x.Verify(command.Password, user.PasswordHash), Times.Once);
        _mockJwtTokenGenerator.Verify(x => x.GenerateToken(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WithNonExistentUser_ShouldThrowException()
    {
        // Arrange
        var command = new LoginCommand { Email = "nonexistent@example.com", Password = "password123" };

        _mockUserRepository.Setup(x => x.GetUserByEmailAsync(command.Email))
            .ThrowsAsync(new InvalidOperationException("User not found"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));

        exception.Message.Should().Be("User not found");
        _mockUserRepository.Verify(x => x.GetUserByEmailAsync(command.Email), Times.Once);
        _mockPasswordHasher.Verify(x => x.Verify(It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        _mockJwtTokenGenerator.Verify(x => x.GenerateToken(It.IsAny<User>()), Times.Never);
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public async Task Handle_WithInvalidEmail_ShouldStillCallRepository(string invalidEmail)
    {
        // Arrange
        var command = new LoginCommand { Email = invalidEmail, Password = "password123" };

        _mockUserRepository.Setup(x => x.GetUserByEmailAsync(invalidEmail))
            .ThrowsAsync(new ArgumentException("Invalid email"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _handler.Handle(command, CancellationToken.None));

        _mockUserRepository.Verify(x => x.GetUserByEmailAsync(invalidEmail), Times.Once);
    }

    [Fact]
    public async Task Handle_WithCancellationToken_ShouldPassTokenToRepository()
    {
        // Arrange
        var user = TestDataBuilder.CreateValidUser("test@example.com", "Test User");
        var command = new LoginCommand { Email = "test@example.com", Password = "password123" };
        var cancellationToken = new CancellationToken(true);

        _mockUserRepository.Setup(x => x.GetUserByEmailAsync(command.Email))
            .ThrowsAsync(new OperationCanceledException());

        // Act & Assert
        await Assert.ThrowsAsync<OperationCanceledException>(
            () => _handler.Handle(command, cancellationToken));

        _mockUserRepository.Verify(x => x.GetUserByEmailAsync(command.Email), Times.Once);
    }
}
