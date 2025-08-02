
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Devspark.Bizcore.ApiService.Services.auth
{
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JwtSecurityTokenHandler _jwtSecurityTokenHandler;

        public UserService(
            ILogger<UserService> logger,
            IHttpContextAccessor httpContextAccessor,
            JwtSecurityTokenHandler jwtSecurityTokenHandler
            )
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
            _jwtSecurityTokenHandler = jwtSecurityTokenHandler;
        }

        private void ValidateHttpContext()
        {
            if (_httpContextAccessor.HttpContext == null)
            {
                _logger.LogError("Could not access HttpContext using the 'httpContextAccessor' object");
                throw new Exception("Error accessing HttpContext");
            }
        }

        public Guid UserGuid
        {
            get
            {
                this.ValidateHttpContext();

                var userId = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (Guid.TryParse(userId, out Guid result))
                {
                    _logger.LogInformation("Returning userId {@UserId} from the ClaimsPrincipal object.", userId);
                    return result;
                }

                var jwtToken = _httpContextAccessor.HttpContext.Request.Headers.Authorization.ToString();
                var stringToken = jwtToken.Replace("Bearer", string.Empty).Trim();
                var token = _jwtSecurityTokenHandler.ReadJwtToken(stringToken);

                if (Guid.TryParse(token.Subject, out result))
                {
                    _logger.LogInformation("Returning userId {@UserId} by decoding the JWT token.", token.Subject);
                    return result;
                }

                _logger.LogError("Could not load UserId from the context");
                throw new Exception("Could not load UserId from the context");
            }
        }
    }
}