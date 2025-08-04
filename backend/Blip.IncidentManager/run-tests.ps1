# Script para executar todos os testes do backend com cobertura de código
param(
    [switch]$Coverage,
    [switch]$Watch,
    [string]$Filter = "",
    [switch]$Verbose
)

Write-Host "🧪 Executando testes do Blip Incident Manager Backend" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

$testProject = "src\Blip.IncidentManager.Tests\Blip.IncidentManager.Tests.csproj"
$coverageDir = "TestResults\Coverage"

# Verificar se o projeto de testes existe
if (!(Test-Path $testProject)) {
    Write-Host "❌ Projeto de testes não encontrado: $testProject" -ForegroundColor Red
    exit 1
}

# Criar diretório de cobertura se não existir
if (!(Test-Path $coverageDir)) {
    New-Item -ItemType Directory -Path $coverageDir -Force | Out-Null
}

# Construir comando base
$command = "dotnet test `"$testProject`""

# Adicionar filtro se especificado
if ($Filter) {
    $command += " --filter `"$Filter`""
    Write-Host "🔍 Filtro aplicado: $Filter" -ForegroundColor Yellow
}

# Configurar cobertura de código
if ($Coverage) {
    Write-Host "📊 Executando com cobertura de código..." -ForegroundColor Cyan
    $command += " --collect:`"XPlat Code Coverage`" --settings:`"src\Blip.IncidentManager.Tests\coverlet.runsettings`""
    $command += " --results-directory:`"$coverageDir`""
}

# Configurar modo watch
if ($Watch) {
    Write-Host "👀 Executando em modo watch..." -ForegroundColor Cyan
    $command += " --watch"
}

# Configurar verbosidade
if ($Verbose) {
    $command += " --verbosity detailed"
} else {
    $command += " --verbosity normal"
}

Write-Host "🚀 Executando comando: $command" -ForegroundColor Blue
Write-Host ""

# Executar testes
try {
    Invoke-Expression $command
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host ""
        Write-Host "✅ Todos os testes foram executados com sucesso!" -ForegroundColor Green
        
        if ($Coverage) {
            Write-Host "📊 Relatórios de cobertura salvos em: $coverageDir" -ForegroundColor Cyan
            Write-Host "💡 Para visualizar o relatório HTML, use: reportgenerator -reports:`"$coverageDir\**\coverage.cobertura.xml`" -targetdir:`"$coverageDir\html`"" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "❌ Alguns testes falharam. Código de saída: $exitCode" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao executar testes: $($_.Exception.Message)" -ForegroundColor Red
    $exitCode = 1
}

Write-Host ""
Write-Host "📋 Exemplos de uso:" -ForegroundColor Magenta
Write-Host "  .\run-tests.ps1                    # Executar todos os testes"
Write-Host "  .\run-tests.ps1 -Coverage          # Executar com cobertura"
Write-Host "  .\run-tests.ps1 -Watch             # Executar em modo watch"
Write-Host "  .\run-tests.ps1 -Filter 'User*'    # Executar testes filtrados"
Write-Host "  .\run-tests.ps1 -Verbose           # Executar com saída detalhada"

exit $exitCode
