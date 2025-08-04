using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;

namespace Blip.IncidentManager.Tests.Helpers
{
    public static class MapperTestHelper
    {
        public static IMapper CreateMapperByProfile<TProfile>()
            where TProfile : Profile
        {
            var loggerMock = new Mock<ILogger>();
            var loggerFactoryMock = new Mock<ILoggerFactory>();

            loggerFactoryMock
                .Setup(factory => factory.CreateLogger(It.IsAny<string>()))
                .Returns(loggerMock.Object);

            var mappingConfig = new MapperConfiguration(mc =>
            {
                mc.AddProfile(typeof(TProfile));
            }, loggerFactoryMock.Object);

            return mappingConfig.CreateMapper();
        }
    }
}
