using Blip.IncidentManager.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Blip.IncidentManager.Infrastructure.ExternalServices
{
    public class IdentityPasswordHasher : IPasswordHasher
    {
        private readonly PasswordHasher<object> _hasher = new();

        public string Hash(string password)
        {
            return _hasher.HashPassword(null, password);
        }

        public bool Verify(string password, string hashedPassword)
        {
            var result = _hasher.VerifyHashedPassword(null, hashedPassword, password);
            return result == PasswordVerificationResult.Success;
        }
    }
}
