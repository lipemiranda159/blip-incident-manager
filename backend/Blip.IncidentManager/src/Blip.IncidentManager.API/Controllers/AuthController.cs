using System.Threading.Tasks;
using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Auth.Commands.Insert;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Blip.IncidentManager.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public AuthController(
            ILogger<AuthController> logger,
            IMediator mediator,
            IMapper mapper)
        {
            _logger = logger;
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            _logger.LogInformation("Login attempt for user: {Username}", request.Email);
            var token = "dummy-jwt-token"; // Replace with actual token generation logic
            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            _logger.LogInformation("Registering new user: {Username}", request.Email);
            var command = _mapper.Map<InsertUserCommand>(request);
            var result = await _mediator.Send(command);
            _logger.LogInformation("Incident created with Id: {IncidentId}", result.Id);
            return CreatedAtAction(nameof(Register), new { id = result.Id }, result);
        }
    }
}
