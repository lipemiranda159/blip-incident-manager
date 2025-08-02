using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Auth.Commands.Login;

namespace Blip.IncidentManager.API.Mappers.V1
{
    public class LoginCommandMapper : Profile
    {
        public LoginCommandMapper()
        {
            CreateMap<LoginRequest, LoginCommand>();
        }
    }
}
