using Blip.IncidentManager.ServiceConfigurations.Section;

namespace Blip.IncidentManager.ServiceConfigurations
{
    public class AppConfig
    {
        public Database Database { get; set; } = new Database();
        public Jwt Jwt { get; set; } = new Jwt();
    }
}
