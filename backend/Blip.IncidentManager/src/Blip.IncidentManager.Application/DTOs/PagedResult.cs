namespace Blip.IncidentManager.Application.DTOs;

public class PagedResult<T>
{
    public int CurrentPage { get; set; }
    public int TotalPages { get; set; }
    public IEnumerable<T>? Items { get; set; } = Enumerable.Empty<T>();
}

