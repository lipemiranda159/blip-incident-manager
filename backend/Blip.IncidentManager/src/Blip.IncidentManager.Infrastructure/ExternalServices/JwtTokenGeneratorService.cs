using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.ServiceConfigurations;
using Microsoft.IdentityModel.Tokens;

namespace Blip.IncidentManager.Infrastructure.ExternalServices
{
    public class JwtTokenGeneratorService : IJwtTokenGeneratorService
    {
        private readonly AppConfig _appConfig;

        public JwtTokenGeneratorService(AppConfig appConfig)
        {
            _appConfig = appConfig;
        }

        public string GenerateToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_appConfig.Jwt.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(
                [
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name)
                ]),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
