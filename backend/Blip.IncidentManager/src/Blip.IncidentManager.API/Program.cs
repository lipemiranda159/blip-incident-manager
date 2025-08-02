using Blip.IncidentManager.API.Extensions;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddIncidentManagerApiService(builder.Configuration);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseIncidentManagerApiSerivce();


app.Run();
