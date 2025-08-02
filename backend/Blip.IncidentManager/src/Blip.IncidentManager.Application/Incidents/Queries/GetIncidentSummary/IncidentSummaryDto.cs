namespace Blip.IncidentManager.Application.Incidents.Queries.GetIncidentSummary
{
    public class IncidentSummaryDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
    }
}
