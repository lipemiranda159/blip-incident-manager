namespace Blip.IncidentManager.Api.ServiceContracts.V1.Request
{
    public class LoginRequest
    {
        public required string Email { get; init; }
        public required string Password { get; init; }
    }
}
