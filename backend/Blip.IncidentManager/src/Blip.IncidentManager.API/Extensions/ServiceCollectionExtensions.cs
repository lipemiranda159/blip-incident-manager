using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Blip.IncidentManager.Application._Extensions;
using Blip.IncidentManager.Application.Incidents.Mappers;
using Blip.IncidentManager.Infrastructure.Extensions;
using Blip.IncidentManager.Persistence.Extensions;
using Blip.IncidentManager.ServiceConfigurations.Extensions;
using Devspark.Bizcore.ApiService.Services.auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace Blip.IncidentManager.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddIncidentManagerApiService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddOpenApi();
            services.AddControllers();

            services.AddScoped<JwtSecurityTokenHandler>();
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped<IUserService, UserService>();

            var config = services.AddServiceConfigurations(configuration);

            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins(config.Cors.AllowedOrigins)
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            services.AddIncidentDbContext(config);
            services.AddIncidentManagerInfrastructure(config);
            services.AddIncidentManagerApplications();

            services.AddAutoMapper(cfg => cfg.AddMaps([typeof(Program).Assembly, typeof(IncidentMapperProfile).Assembly]));

            var key = Encoding.UTF8.GetBytes(config.Jwt.Secret);
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            services.AddAuthorization();

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Incident Manager API",
                    Version = "v1",
                    Description = "API sistema de gerenciamento de chamados"
                });

                // Definir o esquema de segurança para JWT
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    Description = "Digite 'Bearer' [espaço] e então seu token JWT.\nExemplo: \"Bearer seu_token_aqui\""
                });

                // Exigir o token para as operações (se necessário)
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] { }
                    }
                });
            });

            return services;
        }
    }
}
