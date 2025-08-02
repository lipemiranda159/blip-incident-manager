using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Comments;
using Blip.IncidentManager.Application.Comments.Commands;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Application.Incidents;
using Blip.IncidentManager.Application.Incidents.Commands.Delete;
using Blip.IncidentManager.Application.Incidents.Commands.Insert;
using Blip.IncidentManager.Application.Incidents.Commands.Update;
using Blip.IncidentManager.Application.Incidents.Queries.GetAll;
using Blip.IncidentManager.Application.Incidents.Queries.GetById;
using Devspark.Bizcore.ApiService.Services.auth;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Blip.IncidentManager.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class IncidentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;
    private readonly ILogger<IncidentsController> _logger;
    private readonly IUserService _userService;

    public IncidentsController(
        IMediator mediator,
        IMapper mapper,
        ILogger<IncidentsController> logger,
        IUserService userService)
    {
        _mediator = mediator;
        _mapper = mapper;
        _logger = logger;
        _userService = userService;
    }

    [HttpPost]
    public async Task<ActionResult<IncidentDto>> Create([FromBody] CreateIncidentRequest request)
    {
        _logger.LogInformation("Creating a new incident.");
  
        var command = _mapper.Map<CreateIncidentCommand>(request);

        var result = await _mediator.Send(command with { CreatedBy = _userService.UserGuid });
        _logger.LogInformation("Incident created with Id: {IncidentId}", result.Id);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPatch("{id}")]
    public async Task<ActionResult<IncidentDto>> Update(Guid id, [FromBody] UpdateIncidentRequest request)
    {
        _logger.LogInformation("Updating incident with Id: {IncidentId}", id);
        var command = _mapper.Map<UpdateIncidentCommand>(request);
        command = command with { Id = id };
        
        await _mediator.Send(command);

        _logger.LogInformation("Incident with Id: {IncidentId} updated.", id);
        return Ok();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        _logger.LogInformation("Deleting incident with Id: {IncidentId}", id);
        var command = new DeleteIncidentCommand(id);
        await _mediator.Send(command);

        _logger.LogInformation("Incident with Id: {IncidentId} deleted.", id);
        return Ok();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<IncidentDto>> GetById(Guid id)
    {
        _logger.LogInformation("Retrieving incident with Id: {IncidentId}", id);
        var query = new GetIncidentByIdQuery(id);
        var result = await _mediator.Send(query);
        if (result == null)
        {
            _logger.LogWarning("Incident with Id: {IncidentId} not found.", id);
            return NotFound();
        }
        _logger.LogInformation("Incident with Id: {IncidentId} retrieved.", id);
        return Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<IncidentDto>>> GetAll(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        _logger.LogInformation("Retrieving incidents. Page: {PageNumber}, Size: {PageSize}", pageNumber, pageSize);
        var query = new GetAllIncidentsQuery(pageNumber, pageSize);
        var result = await _mediator.Send(query);
        _logger.LogInformation("Retrieved {Count} incidents on page {PageNumber} of {TotalPages}.", result?.Items?.Count() ?? 0, result?.CurrentPage, result?.TotalPages);
        return Ok(result);
    }

    [HttpPost("{incidentId}/comments")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid incidentId, [FromBody] CreateCommentRequest request)
    {
        _logger.LogInformation("Adding comment to incident {IncidentId}", incidentId);

        var command = _mapper.Map<CreateCommentCommand>(request);
        command.IncidentId = incidentId;
        command.AuthorId = _userService.UserGuid;

        var result = await _mediator.Send(command);

        _logger.LogInformation("Comment added to incident {IncidentId} with CommentId: {CommentId}", incidentId, result.Id);
        return CreatedAtAction(nameof(GetById), new { id = incidentId }, result);
    }
}
