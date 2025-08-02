using Microsoft.AspNetCore.Mvc;
using MediatR;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using AutoMapper;
using Blip.IncidentManager.Application.Incidents;
using Blip.IncidentManager.Application.Incidents.Commands;
using Blip.IncidentManager.Application.Incidents.Commands.Insert;
using Blip.IncidentManager.Application.Incidents.Queries;

namespace Blip.IncidentManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncidentsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IMapper _mapper;
    private readonly ILogger<IncidentsController> _logger;

    public IncidentsController(
        IMediator mediator,
        IMapper mapper,
        ILogger<IncidentsController> logger)
    {
        _mediator = mediator;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<IncidentDto>> Create([FromBody] CreateIncidentRequest request)
    {
        _logger.LogInformation("Creating a new incident.");
        var command = _mapper.Map<CreateIncidentCommand>(request);
        var result = await _mediator.Send(command);
        _logger.LogInformation("Incident created with Id: {IncidentId}", result.Id);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<IncidentDto>> Update(Guid id, [FromBody] UpdateIncidentRequest request)
    {
        _logger.LogInformation("Updating incident with Id: {IncidentId}", id);
        var command = _mapper.Map<UpdateIncidentCommand>(request) with { Id = id };
        var result = await _mediator.Send(command);
        if (result == null)
        {
            _logger.LogWarning("Incident with Id: {IncidentId} not found for update.", id);
            return NotFound();
        }
        _logger.LogInformation("Incident with Id: {IncidentId} updated.", id);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        _logger.LogInformation("Deleting incident with Id: {IncidentId}", id);
        var command = new DeleteIncidentCommand(id);
        var result = await _mediator.Send(command);
        if (!result)
        {
            _logger.LogWarning("Incident with Id: {IncidentId} not found for deletion.", id);
            return NotFound();
        }
        _logger.LogInformation("Incident with Id: {IncidentId} deleted.", id);
        return NoContent();
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
        _logger.LogInformation("Retrieved {Count} incidents on page {PageNumber} of {TotalPages}.", result?.Items.Count() ?? 0, result?.CurrentPage, result?.TotalPages);
        return Ok(result);
    }
}
