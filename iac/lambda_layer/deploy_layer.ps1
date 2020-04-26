function CleanLayerVersions($layer_name) {
    $version_data = aws lambda list-layer-versions --layer-name $layer_name | ConvertFrom-Json
    $versions = $version_data.LayerVersions.Version
    
    foreach($version in $versions) {
        aws lambda delete-layer-version `
            --layer-name $layer_name `
            --version-number $version | Out-Null
    }
}

$ErrorActionPreference = "Stop"

$layer_name = "pipeline-util-layer"
$pipeline_functions = @("codepipeline-install", "codepipeline-build", "codepipeline-run")

Write-Output "Creating layer package..."
Compress-Archive -f pipeline-util-layer/* out/pipeline-util-layer.zip

Write-Output "Cleaning previous layer versions..."
CleanLayerVersions $layer_name

Write-Output "Publishing layer..."
$layer_data = aws lambda publish-layer-version `
    --layer-name $layer_name `
    --compatible-runtimes python3.8 `
    --zip-file fileb://out/pipeline-util-layer.zip `
        | ConvertFrom-Json

Write-Output "Updating functions..."
foreach($function in $pipeline_functions) {
    aws lambda update-function-configuration `
        --function-name $function `
        --layers $layer_data.LayerVersionArn | Out-Null
}

Write-Output "Complete"