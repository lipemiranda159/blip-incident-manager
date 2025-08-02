using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Auth.Commands.Insert;

namespace Blip.IncidentManager.API.Mappers.V1
{
    public class CreateUserCommandMapper : Profile
    {
        public CreateUserCommandMapper()
        {
            CreateMap<RegisterUserRequest, InsertUserCommand>();
        }
    }

}
