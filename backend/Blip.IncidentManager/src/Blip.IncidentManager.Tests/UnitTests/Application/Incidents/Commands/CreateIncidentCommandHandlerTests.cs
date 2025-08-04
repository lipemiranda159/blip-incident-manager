using AutoMapper;
using Blip.IncidentManager.Application.Auth;
using Blip.IncidentManager.Application.Incidents;
using Blip.IncidentManager.Application.Incidents.Commands.Insert;
using Blip.IncidentManager.Application.Incidents.Mappers;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Domain.Interfaces;
using Blip.IncidentManager.Tests.Helpers;
using FluentAssertions;
using Moq;

namespace Blip.IncidentManager.Tests.UnitTests.Application.Incidents.Commands;

public class CreateIncidentCommandHandlerTests : TestBase
{
    private readonly Mock<IUnitOfWork> _mockUnitOfWork;
    private readonly Mock<IRepository<Incident>> _mockIncidentRepository;
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly IMapper _mockMapper;
    private readonly CreateIncidentCommandHandler _handler;

    public CreateIncidentCommandHandlerTests()
    {
        _mockUnitOfWork = new Mock<IUnitOfWork>();
        _mockIncidentRepository = new Mock<IRepository<Incident>>();
        _mockUserRepository = new Mock<IUserRepository>();
        _mockMapper = MapperTestHelper.CreateMapperByProfile<IncidentMapperProfile>();

        _mockUnitOfWork.Setup(x => x.GetIncidents()).Returns(_mockIncidentRepository.Object);
        _mockUnitOfWork.Setup(x => x.GetUsers()).Returns(_mockUserRepository.Object);
        _handler = new CreateIncidentCommandHandler(_mockUnitOfWork.Object, _mockMapper);
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateIncidentAndReturnDto()
    {
        // Arrange
        var command = new CreateIncidentCommand
        {
            Title = "Test Incident",
            Description = "Test Description",
            CreatedBy = Guid.NewGuid(),
            Priority = "High",
            Category = "Bug"
        };

        var createdIncident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = command.Title,
            Description = command.Description,
            CreatedById = command.CreatedBy,
            Status = "Aberto",
            Priority = command.Priority,
            Category = command.Category,
            CreatedAt = DateTime.UtcNow
        };

        _mockIncidentRepository.Setup(x => x.AddAsync(It.IsAny<Incident>()))
            .ReturnsAsync(createdIncident);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(0));

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(createdIncident.Id);
        result.Title.Should().Be(command.Title);
        result.Description.Should().Be(command.Description);
        result.CreatedAt.Should().Be(createdIncident.CreatedAt);

        _mockIncidentRepository.Verify(x => x.AddAsync(It.Is<Incident>(i =>
            i.Title == command.Title &&
            i.Description == command.Description &&
            i.CreatedById == command.CreatedBy &&
            i.Status == "Aberto" &&
            i.Priority == command.Priority &&
            i.Category == command.Category)), Times.Once);
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithMinimalData_ShouldCreateIncidentWithDefaults()
    {
        // Arrange
        var command = new CreateIncidentCommand
        {
            Title = "Minimal Incident",
            Description = "Minimal Description",
            CreatedBy = Guid.NewGuid(),
            Priority = null,
            Category = null
        };

        var createdIncident = new Incident
        {
            Id = Guid.NewGuid(),
            Title = command.Title,
            Description = command.Description,
            CreatedById = command.CreatedBy,
            Status = "Aberto",
            Priority = command.Priority,
            Category = command.Category,
            CreatedAt = DateTime.UtcNow
        };

        _mockIncidentRepository.Setup(x => x.AddAsync(It.IsAny<Incident>()))
            .ReturnsAsync(createdIncident);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.Should().NotBeNull();
        result.Title.Should().Be(command.Title);
        result.Description.Should().Be(command.Description);

        _mockIncidentRepository.Verify(x => x.AddAsync(It.Is<Incident>(i =>
            i.Status == "Aberto")), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenRepositoryFails_ShouldThrowException()
    {
        // Arrange
        var command = new CreateIncidentCommand
        {
            Title = "Test Incident",
            Description = "Test Description",
            CreatedBy = Guid.NewGuid(),
            Priority = "High",
            Category = "Bug"
        };

        _mockIncidentRepository.Setup(x => x.AddAsync(It.IsAny<Incident>()))
            .ThrowsAsync(new InvalidOperationException("Database error"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));

        exception.Message.Should().Be("Database error");
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenSaveChangesFails_ShouldThrowException()
    {
        // Arrange
        var command = new CreateIncidentCommand
        {
            Title = "Test Incident",
            Description = "Test Description",
            CreatedBy = Guid.NewGuid(),
            Priority = "High",
            Category = "Bug"
        };

        var createdIncident = TestDataBuilder.CreateValidIncident();
        _mockIncidentRepository.Setup(x => x.AddAsync(It.IsAny<Incident>()))
            .ReturnsAsync(createdIncident);
        _mockUnitOfWork.Setup(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new InvalidOperationException("Save failed"));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None));

        exception.Message.Should().Be("Save failed");
        _mockIncidentRepository.Verify(x => x.AddAsync(It.IsAny<Incident>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WithCancellationToken_ShouldPassTokenToSaveChanges()
    {
        // Arrange
        var command = new CreateIncidentCommand
        {
            Title = "Test Incident",
            Description = "Test Description",
            CreatedBy = Guid.NewGuid(),
            Priority = "High",
            Category = "Bug"
        };

        var createdIncident = TestDataBuilder.CreateValidIncident();
        var cancellationToken = new CancellationToken();

        _mockIncidentRepository.Setup(x => x.AddAsync(It.IsAny<Incident>()))
            .ReturnsAsync(createdIncident);

        // Act
        await _handler.Handle(command, cancellationToken);

        // Assert
        _mockUnitOfWork.Verify(x => x.SaveChangesAsync(cancellationToken), Times.Once);
    }
}
