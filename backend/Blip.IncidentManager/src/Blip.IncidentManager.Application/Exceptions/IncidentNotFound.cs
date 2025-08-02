namespace Blip.IncidentManager.Application.Exceptions
{
    [Serializable]
    internal class IncidentNotFound : Exception
    {
        public IncidentNotFound()
        {
        }

        public IncidentNotFound(string? message) : base(message)
        {
        }

        public IncidentNotFound(string? message, Exception? innerException) : base(message, innerException)
        {
        }
    }
}