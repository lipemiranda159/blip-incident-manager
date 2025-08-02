using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Blip.IncidentManager.Application.Auth.Commands.Login
{
    public class LoginCommandHandler : IRequestHandler<LoginCommand, string>
    {
        private readonly ILogger<LoginCommandHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtTokenGeneratorService _jwtTokenGeneratorService;

        public LoginCommandHandler(
            ILogger<LoginCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IPasswordHasher passwordHasher,
            IJwtTokenGeneratorService jwtTokenGeneratorService)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
            _jwtTokenGeneratorService = jwtTokenGeneratorService;
            _logger = logger;
        }
        public async Task<string> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var user = await _unitOfWork.GetUsers().GetUserByEmailAsync(request.Email);

            if (_passwordHasher.Verify(request.Password, user.PasswordHash))
            {
                _logger.LogInformation("User {Email} logged in successfully", request.Email);
                return _jwtTokenGeneratorService.GenerateToken(user);
            }
            else
            {
                _logger.LogWarning("Login attempt failed for user {Email}", request.Email);
                throw new UnauthorizedAccessException("Invalid email or password.");
            }

        }
    }
}
