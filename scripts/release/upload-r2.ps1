<#
.SYNOPSIS
  Publie un installateur officiel TSA vers le stockage d'objets Cloudflare R2 et met a jour SHA256SUMS.txt.

.DESCRIPTION
  Ce script transfere un installateur binaire volumineux directement vers le bucket
  Cloudflare R2 configure pour distribuer les telechargements sans transiter par GitHub.

.PARAMETER FilePath
  Chemin local vers l'installateur compile (ex: ..\TSA\build-ninja-release\dist\TSA-0.1.0-windows-x64-setup.exe)

.PARAMETER BucketName
  Nom du bucket R2 (par defaut: $env:R2_BUCKET_NAME ou 'tsa-downloads')

.PARAMETER Prefix
  Prefixe du chemin dans le bucket (par defaut: 'releases')

.PARAMETER DryRun
  Si specifie, simule l'operation sans envoyer de fichier.
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$FilePath,

    [string]$BucketName = $(if ($env:R2_BUCKET_NAME) { $env:R2_BUCKET_NAME } else { "tsa-downloads" }),
    [string]$Prefix = "releases",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $FilePath)) {
    Write-Error ("Fichier introuvable : " + $FilePath)
    exit 1
}

$fileItem = Get-Item $FilePath
$fileName = $fileItem.Name
$fileSize = $fileItem.Length
$fileSizeMB = [math]::Round($fileSize / 1MB, 2)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " TSA Professional Distribution - Cloudflare R2 Publisher  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ("Fichier local    : " + $FilePath)
Write-Host ("Nom du package   : " + $fileName)
Write-Host ("Taille           : {0} octets ({1} Mo)" -f $fileSize, $fileSizeMB)
Write-Host ("Bucket R2 cible  : " + $BucketName)
Write-Host ("Cle distante     : {0}/{1}" -f $Prefix, $fileName)

Write-Host "`n[1/3] Calcul de l'empreinte cryptographique SHA-256..." -ForegroundColor Yellow
$hashResult = (Get-FileHash -Path $FilePath -Algorithm SHA256).Hash.ToLower()
Write-Host ("SHA-256          : " + $hashResult) -ForegroundColor Green

# Preparation de SHA256SUMS.txt
$tempDir = [System.IO.Path]::GetTempPath()
$sumsFile = Join-Path $tempDir "SHA256SUMS.txt"
$sumLine = ("{0}  {1}" -f $hashResult, $fileName)
Set-Content -Path $sumsFile -Value $sumLine -Encoding utf8
Write-Host ("Fichier SHA256SUMS prepare : " + $sumLine)

if ($DryRun) {
    Write-Host "`n[DRY RUN] Mode simulation active. Aucun transfert n'a ete effectue." -ForegroundColor Magenta
    Write-Host "Commandes de televersement prevues :"
    Write-Host ("  aws s3 cp `"{0}`" `"s3://{1}/{2}/{3}`" --endpoint-url `"`$env:R2_ENDPOINT_URL`" --content-type `"application/octet-stream`"" -f $FilePath, $BucketName, $Prefix, $fileName)
    Write-Host ("  aws s3 cp `"{0}`" `"s3://{1}/{2}/SHA256SUMS.txt`" --endpoint-url `"`$env:R2_ENDPOINT_URL`" --content-type `"text/plain`"" -f $sumsFile, $BucketName, $Prefix)
    exit 0
}

Write-Host "`n[2/3] Verification des outils de transfert..." -ForegroundColor Yellow

$hasAwsCli = $null -ne (Get-Command "aws" -ErrorAction SilentlyContinue)
$hasWrangler = $null -ne (Get-Command "wrangler" -ErrorAction SilentlyContinue)

if (-not $hasAwsCli -and -not $hasWrangler) {
    Write-Warning "Ni l'outil aws (AWS CLI compatible S3) ni wrangler (Cloudflare CLI) ne sont installes."
    Write-Host "Pour televerser le package vers Cloudflare R2, vous pouvez :"
    Write-Host "  1. Installer AWS CLI ou Wrangler :"
    Write-Host "     npm install -g wrangler"
    Write-Host ("     wrangler r2 object put `"{0}/{1}/{2}`" --file `"{3}`"" -f $BucketName, $Prefix, $fileName, $FilePath)
    Write-Host "  2. Ou glisser-deposer le fichier directement dans la console Cloudflare :"
    Write-Host ("     https://dash.cloudflare.com -> R2 -> {0} -> Upload" -f $BucketName)
    exit 2
}

Write-Host "`n[3/3] Televersement vers Cloudflare R2..." -ForegroundColor Yellow
if ($hasWrangler) {
    Write-Host "Utilisation de Cloudflare Wrangler CLI..."
    & wrangler r2 object put ("{0}/{1}/{2}" -f $BucketName, $Prefix, $fileName) --file $FilePath
    & wrangler r2 object put ("{0}/{1}/SHA256SUMS.txt" -f $BucketName, $Prefix) --file $sumsFile
} elseif ($hasAwsCli) {
    Write-Host "Utilisation de AWS CLI avec R2 endpoint..."
    $endpoint = if ($env:R2_ENDPOINT_URL) { $env:R2_ENDPOINT_URL } else { "https://$($env:R2_ACCOUNT_ID).r2.cloudflarestorage.com" }
    & aws s3 cp $FilePath ("s3://{0}/{1}/{2}" -f $BucketName, $Prefix, $fileName) --endpoint-url $endpoint --cache-control "public, max-age=31536000, immutable"
    & aws s3 cp $sumsFile ("s3://{0}/{1}/SHA256SUMS.txt" -f $BucketName, $Prefix) --endpoint-url $endpoint --cache-control "no-cache"
}

Write-Host "`nTeleversement termine avec succes !" -ForegroundColor Green
Write-Host ("URL publique : https://downloads.tsaraloha.org/{0}/{1}" -f $Prefix, $fileName) -ForegroundColor Cyan
