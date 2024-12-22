# Setup script for Windows environment

# Check Node.js installation
$nodeVersion = node -v
if ($LASTEXITCODE -ne 0) {
    Write-Error "Node.js is not installed!"
    exit 1
}

# Create required directories
$directories = @("logs", "backups", "data")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir
        Write-Host "Created directory: $dir"
    }
}

# Install dependencies
npm install --production

# Copy environment file if it doesn't exist
if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Created .env file - please configure it"
}

# Set up Windows service
$servicePath = Join-Path $PSScriptRoot "..\src\deployment\windowsService.js"
node $servicePath install

Write-Host "Setup completed successfully!"
