using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Domain.Interfaces;
using MediatR;

namespace Blip.IncidentManager.Application.Auth.Commands.Insert
{
    public class InsertUserCommandHandler : IRequestHandler<InsertUserCommand, UserDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPasswordHasher _passwordHasher;

        public InsertUserCommandHandler(IUnitOfWork unitOfWork, IPasswordHasher passwordHasher)
        {
            _unitOfWork = unitOfWork;
            _passwordHasher = passwordHasher;
        }
        public async Task<UserDto> Handle(InsertUserCommand request, CancellationToken cancellationToken)
        {
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Type = request.Type,
                Avatar = request.Avatar,
                PasswordHash = _passwordHasher.Hash(request.Password) 
            };
            var newUser = await _unitOfWork.GetUsers().AddAsync(user);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return new UserDto(newUser.Id, newUser.Name, newUser.Email, newUser.Type, newUser.Avatar!);
        }
    }

}
