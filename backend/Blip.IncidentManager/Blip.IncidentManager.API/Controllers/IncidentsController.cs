using Microsoft.AspNetCore.Mvc;
using MediatR;
using Blip.IncidentManager.Application.Commands;
using Blip.IncidentManager.Application.DTOs;

namespace Blip.IncidentManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncidentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public IncidentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<IncidentDto>> Create([FromBody] CreateIncidentCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(Create), new { id = result.Id }, result);
    }
}
