import os
import subprocess

solution_name = "Blip.IncidentManager"
base_path = os.path.join(os.getcwd(), solution_name)

projects = {
    "Blip.IncidentManager.API": "API Gateway",
    "Blip.IncidentManager.Application": "Camada de aplicação (CQRS, interfaces, DTOs, use cases)",
    "Blip.IncidentManager.Domain": "Camada de domínio (entidades, enums, interfaces)",
    "Blip.IncidentManager.Infrastructure": "Infraestrutura (Repositórios, serviços externos)",
    "Blip.IncidentManager.Persistence": "Persistência (DbContext, Migrations)",
    "Blip.IncidentManager.Tests": "Testes unitários",
}

subfolders = {
    "Blip.IncidentManager.API": ["Controllers", "Middlewares", "Extensions"],
    "Blip.IncidentManager.Application": ["Commands", "Handlers", "DTOs", "Services", "Interfaces"],
    "Blip.IncidentManager.Domain": ["Entities", "ValueObjects", "Enums", "Interfaces"],
    "Blip.IncidentManager.Infrastructure": ["Repositories", "ExternalServices"],
    "Blip.IncidentManager.Persistence": ["Configurations", "Migrations", "Contexts"],
    "Blip.IncidentManager.Tests": ["UnitTests", "Builders", "Fakes"]
}

def run_command(command, cwd=None):
    print(f"🔧 {command}")
    result = subprocess.run(command, shell=True, cwd=cwd)
    if result.returncode != 0:
        raise Exception(f"Erro ao executar: {command}")

def create_solution():
    os.makedirs(base_path, exist_ok=True)
    run_command(f"dotnet new sln -n {solution_name}", cwd=base_path)

def create_projects():
    for project in projects:
        output_dir = os.path.join(base_path, project)
        template = "webapi" if project.endswith(".API") else "xunit" if project.endswith(".Tests") else "classlib"
        run_command(f"dotnet new {template} -n {project} -f net9.0 --output {output_dir}", cwd=base_path)

def create_subfolders():
    for project, folders in subfolders.items():
        for folder in folders:
            path = os.path.join(base_path, project, folder)
            os.makedirs(path, exist_ok=True)
            with open(os.path.join(path, ".gitkeep"), "w") as f:
                f.write("")

def add_projects_to_solution():
    for project in projects:
        csproj_path = os.path.join(base_path, project, f"{project}.csproj")
        run_command(f"dotnet sln {solution_name}.sln add \"{csproj_path}\"", cwd=base_path)

def add_project_references():
    references = {
        "Blip.IncidentManager.API": [
            "Blip.IncidentManager.Application",
            "Blip.IncidentManager.Infrastructure",
        ],
        "Blip.IncidentManager.Application": [
            "Blip.IncidentManager.Domain",
        ],
        "Blip.IncidentManager.Infrastructure": [
            "Blip.IncidentManager.Application",
            "Blip.IncidentManager.Persistence",
        ],
        "Blip.IncidentManager.Persistence": [
            "Blip.IncidentManager.Domain",
        ],
        "Blip.IncidentManager.Tests": [
            "Blip.IncidentManager.Application",
            "Blip.IncidentManager.Domain",
        ]
    }

    for project, refs in references.items():
        proj_path = os.path.join(base_path, project)
        for ref in refs:
            ref_path = os.path.join(base_path, ref, f"{ref}.csproj")
            run_command(f"dotnet add \"{project}.csproj\" reference \"{ref_path}\"", cwd=proj_path)

def write_file(path, content):
    with open(path, "w") as f:
        f.write(content)

def create_example_files():
    # Domain - Incident.cs
    domain_path = os.path.join(base_path, "Blip.IncidentManager.Domain", "Entities", "Incident.cs")
    write_file(domain_path, """namespace Blip.IncidentManager.Domain.Entities;

public class Incident
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
""")

    # Application - DTO
    dto_path = os.path.join(base_path, "Blip.IncidentManager.Application", "DTOs", "IncidentDto.cs")
    write_file(dto_path, """namespace Blip.IncidentManager.Application.DTOs;

public record IncidentDto(Guid Id, string Title, string Description, DateTime CreatedAt);
""")

    # Application - Command
    command_path = os.path.join(base_path, "Blip.IncidentManager.Application", "Commands", "CreateIncidentCommand.cs")
    write_file(command_path, """using MediatR;
using Blip.IncidentManager.Application.DTOs;

namespace Blip.IncidentManager.Application.Commands;

public record CreateIncidentCommand(string Title, string Description) : IRequest<IncidentDto>;
""")

    # Application - Handler
    handler_path = os.path.join(base_path, "Blip.IncidentManager.Application", "Handlers", "CreateIncidentCommandHandler.cs")
    write_file(handler_path, """using MediatR;
using Blip.IncidentManager.Application.Commands;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Handlers;

public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, IncidentDto>
{
    public async Task<IncidentDto> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        var incident = new Incident
        {
            Title = request.Title,
            Description = request.Description
        };

        return new IncidentDto(incident.Id, incident.Title, incident.Description, incident.CreatedAt);
    }
}
""")

    # Infrastructure - Repository stub
    repo_path = os.path.join(base_path, "Blip.IncidentManager.Infrastructure", "Repositories", "IncidentRepository.cs")
    write_file(repo_path, """namespace Blip.IncidentManager.Infrastructure.Repositories;

public class IncidentRepository
{
    // TODO: Implementar persistência real
}
""")

    # Persistence - DbContext
    dbcontext_path = os.path.join(base_path, "Blip.IncidentManager.Persistence", "Contexts", "IncidentDbContext.cs")
    write_file(dbcontext_path, """using Microsoft.EntityFrameworkCore;
using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Persistence.Contexts;

public class IncidentDbContext : DbContext
{
    public IncidentDbContext(DbContextOptions<IncidentDbContext> options) : base(options) { }

    public DbSet<Incident> Incidents => Set<Incident>();
}
""")

    # API - Controller
    controller_path = os.path.join(base_path, "Blip.IncidentManager.API", "Controllers", "IncidentsController.cs")
    write_file(controller_path, """using Microsoft.AspNetCore.Mvc;
using MediatR;
using Blip.IncidentManager.Application.Commands;
using Blip.IncidentManager.Application.DTOs;

namespace Blip.IncidentManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncidentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public IncidentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<IncidentDto>> Create([FromBody] CreateIncidentCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(Create), new { id = result.Id }, result);
    }
}
""")

def create_readme():
    readme_path = os.path.join(base_path, "README.md")
    with open(readme_path, "w") as f:
        f.write(f"# {solution_name}\n\n")
        f.write("Este projeto segue a arquitetura Onion com suporte a CQRS.\n\n")
        for project, desc in projects.items():
            f.write(f"- **{project}**: {desc}\n")

def main():
    print(f"\n🚀 Criando solução {solution_name} com Onion + CQRS...\n")
    create_solution()
    create_projects()
    create_subfolders()
    add_projects_to_solution()
    add_project_references()
    create_example_files()
    create_readme()
    print("\n✅ Estrutura final criada com sucesso com arquivos de exemplo!\n")

if __name__ == "__main__":
    main()
