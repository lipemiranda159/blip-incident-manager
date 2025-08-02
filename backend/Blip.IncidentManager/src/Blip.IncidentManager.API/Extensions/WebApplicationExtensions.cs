namespace Blip.IncidentManager.API.Extensions
{
    public static class WebApplicationExtensions
    {
        public static WebApplication UseIncidentManagerApiSerivce(this WebApplication app)
        {
            app.UseHttpsRedirection();         // Redireciona para HTTPS antes de tudo

            app.UseCors("AllowFrontend");      // CORS tem que vir antes da autenticação/autorização

            app.UseAuthentication();           
            app.UseAuthorization();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.RoutePrefix = "swagger";
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "BizCore V1");
                options.DefaultModelsExpandDepth(-1);
            });

            app.MapControllers();
            return app;
        }
    }
}
