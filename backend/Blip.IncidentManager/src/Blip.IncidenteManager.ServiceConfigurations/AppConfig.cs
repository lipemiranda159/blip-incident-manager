using Blip.IncidentManager.ServiceConfigurations.Section;

namespace Blip.IncidentManager.ServiceConfigurations
{
    public class AppConfig
    {
        public Database Database { get; set; } = new Database();
        public Jwt Jwt { get; set; } = new Jwt();
        public Gemini Gemini { get; set; } = new Gemini();
        public Cors Cors { get; set; } = new Cors();
    }
}
