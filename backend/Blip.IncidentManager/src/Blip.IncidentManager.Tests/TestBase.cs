using AutoFixture;
using AutoFixture.Xunit2;
using Microsoft.Extensions.Logging;
using Moq;

namespace Blip.IncidentManager.Tests;

/// <summary>
/// Classe base para testes com configurações comuns
/// </summary>
public abstract class TestBase
{
    protected readonly IFixture Fixture;
    protected readonly Mock<ILogger> MockLogger;

    protected TestBase()
    {
        Fixture = new Fixture();
        MockLogger = new Mock<ILogger>();
        
        // Configurações padrão do AutoFixture
        Fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(b => Fixture.Behaviors.Remove(b));
        Fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    /// <summary>
    /// Cria um mock genérico de ILogger para testes
    /// </summary>
    /// <typeparam name="T">Tipo para o logger</typeparam>
    /// <returns>Mock do ILogger</returns>
    protected Mock<ILogger<T>> CreateMockLogger<T>()
    {
        return new Mock<ILogger<T>>();
    }
}

/// <summary>
/// Atributo personalizado para AutoData com configurações específicas
/// </summary>
public class AutoMoqDataAttribute : AutoDataAttribute
{
    public AutoMoqDataAttribute() : base(() =>
    {
        var fixture = new Fixture();
        fixture.Behaviors.OfType<ThrowingRecursionBehavior>().ToList()
            .ForEach(b => fixture.Behaviors.Remove(b));
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
        return fixture;
    })
    {
    }
}
