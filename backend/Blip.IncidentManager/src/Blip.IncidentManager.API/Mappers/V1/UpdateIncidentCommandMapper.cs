using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Incidents.Commands.Update;

namespace Blip.IncidentManager.API.Mappers.V1
{
    public class UpdateIncidentCommandMapper : Profile
    {
        public UpdateIncidentCommandMapper()
        {
            CreateMap<UpdateIncidentRequest, UpdateIncidentCommand>();
        }
    }

}
