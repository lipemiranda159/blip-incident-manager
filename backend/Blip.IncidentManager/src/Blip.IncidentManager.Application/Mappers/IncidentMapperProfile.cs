using AutoMapper;
using Blip.IncidentManager.Application.Auth;
using Blip.IncidentManager.Application.Comments;
using Blip.IncidentManager.Application.Incidents.Queries.GetById;
using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Incidents.Mappers
{
    public class IncidentMapperProfile : Profile
    {
        public IncidentMapperProfile()
        {
            CreateMap<User, UserDto>();

            CreateMap<Comment, CommentDto>(); ;

            CreateMap<Incident, IncidentDto>();
        }
    }
}
