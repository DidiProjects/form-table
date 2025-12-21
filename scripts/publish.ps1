# PowerShell Publication Script for @dspackages/highlight-text
param(
    [Parameter()]
    [ValidateSet("patch", "minor", "major")]
    [string]$VersionType = "patch"
)

# Colors for console output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    } else {
        $input | Write-Output
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Invoke-SafeCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-ColorOutput Blue "`n$Description..."
    
    try {
        Invoke-Expression $Command
        if ($LASTEXITCODE -ne 0) {
            throw "Command failed with exit code $LASTEXITCODE"
        }
        Write-ColorOutput Green "Success: $Description completed successfully"
    }
    catch {
        Write-ColorOutput Red "Error: $Description failed"
        Write-ColorOutput Red "Details: $($_.Exception.Message)"
        exit 1
    }
}

function Get-PackageVersion {
    $packagePath = Join-Path $PSScriptRoot "..\package.json"
    $packageJson = Get-Content $packagePath | ConvertFrom-Json
    return $packageJson.version
}

# Main execution
$currentVersion = Get-PackageVersion

Write-ColorOutput Magenta "Starting publication process..."
Write-ColorOutput Cyan "Current version: $currentVersion"
Write-ColorOutput Cyan "Version bump type: $VersionType"

# Step 1: Run tests
Invoke-SafeCommand "npm test" "Running unit tests"

# Step 2: Build the project
Invoke-SafeCommand "npm run build" "Building project"

# Step 3: Version bump
Invoke-SafeCommand "npm version $VersionType" "Bumping $VersionType version"

$newVersion = Get-PackageVersion
Write-ColorOutput Green "New version: $newVersion"

# Step 4: Publish to npm
Invoke-SafeCommand "npm publish --ignore-scripts" "Publishing to npm"

# Step 5: Git push with tags
Invoke-SafeCommand "git push --follow-tags" "Pushing to git with tags"

Write-ColorOutput Green "Publication completed successfully!"
Write-ColorOutput Cyan "Package @dspackages/highlight-text@$newVersion is now available on npm"