using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Commands;

namespace Blip.IncidentManager.API.Mappers.V1
{
    public class CreateIncidentCommandMapper : Profile
    {
        public CreateIncidentCommandMapper()
        {
            CreateMap<CreateIncidentRequest, CreateIncidentCommand>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
        }
    }

}
