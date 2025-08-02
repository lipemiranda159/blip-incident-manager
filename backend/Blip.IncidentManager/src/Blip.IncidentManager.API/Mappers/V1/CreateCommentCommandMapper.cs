using AutoMapper;
using Blip.IncidentManager.Api.ServiceContracts.V1.Request;
using Blip.IncidentManager.Application.Comments.Commands;

namespace Blip.IncidentManager.API.Mappers.V1
{
    public class CreateCommentCommandMapper : Profile
    {
        public CreateCommentCommandMapper()
        {
            CreateMap<CreateCommentRequest, CreateCommentCommand>();
        }
    }
}
