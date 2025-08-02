namespace Blip.IncidentManager.Application.Interfaces
{
    public interface IIncidentSummaryAiService
    {
        Task<string> GenerateSummaryAsync(string title, string description, List<string> comments, CancellationToken cancellationToken);
    }
}
