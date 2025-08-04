using Blip.IncidentManager.ServiceConfigurations.Section;

namespace Blip.IncidentManager.ServiceConfigurations
{
    public class AppConfig
    {
        public Database Database { get; set; } = new Database();
        public Jwt Jwt { get; set; } = new Jwt();
        public AiConfig AiConfig { get; set; } = new AiConfig();
        public Cors Cors { get; set; } = new Cors();
    }
}
