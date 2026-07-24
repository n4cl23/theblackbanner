param(
  [string]$Source = 'C:\Users\Janderson Santos\Desktop\Chronicles of Asterheim',
  [string]$Reports = 'reports'
)

$ErrorActionPreference = 'Stop'

function Convert-ToWebSlug([string]$Value) {
  $normalized = $Value.Normalize([Text.NormalizationForm]::FormD)
  $builder = [Text.StringBuilder]::new()
  foreach ($character in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($character) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($character)
    }
  }
  return (($builder.ToString().Normalize([Text.NormalizationForm]::FormC).ToLowerInvariant() -replace '[^a-z0-9]+', '-') -replace '(^-|-$)', '')
}

function Get-ContentType([string]$Extension) {
  switch ($Extension) {
    { $_ -in '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg' } { return 'image' }
    { $_ -in '.mp4', '.webm', '.mov', '.mkv' } { return 'video' }
    '.glb' { return 'model-3d' }
    { $_ -in '.stl', '.3mf', '.cxdlpv4', '.cfgx' } { return 'private-print' }
    { $_ -in '.pdf', '.docx', '.doc', '.txt', '.md', '.json' } { return 'document' }
    { $_ -in '.exe', '.dll', '.msi', '.winmd' } { return 'executable-or-system' }
    { $_ -in '.zip', '.7z', '.rar' } { return 'archive' }
    default { return 'other' }
  }
}

function Get-ImageMetadata([string]$Path, [string]$Extension) {
  if ($Extension -eq '.svg') { return @{} }
  try {
    Add-Type -AssemblyName System.Drawing
    $image = [Drawing.Image]::FromFile($Path)
    try {
      return @{ width = $image.Width; height = $image.Height; durationSeconds = $null }
    } finally { $image.Dispose() }
  } catch {
    return @{ invalid = $true }
  }
}

function Get-InferredEntity([string]$RelativePath) {
  $segments = $RelativePath -split '[\\/]'
  if ($segments.Count -gt 1) { return $segments[$segments.Count - 2] }
  return [IO.Path]::GetFileNameWithoutExtension($segments[0])
}

function Get-Recommendation([string]$Type, [string]$RelativePath, [string]$EntitySlug, [string]$NameSlug, [string]$Extension) {
  $relativeLower = $RelativePath.ToLowerInvariant()
  switch ($Type) {
    'image' {
      if ($relativeLower -match 'logo|symbol|sigil|coroa|crown') { return "public/media/brand/symbols/$NameSlug$Extension" }
      if ($relativeLower -match 'map|mapa') { return "public/media/maps/$NameSlug$Extension" }
      return "public/media/entities/$EntitySlug/gallery/$NameSlug$Extension"
    }
    'video' { return "public/media/entities/$EntitySlug/video/$NameSlug$Extension" }
    'model-3d' { return "pending-private-storage/models/$EntitySlug/$NameSlug$Extension" }
    'private-print' { return "pending-private-storage/print/$EntitySlug/$NameSlug$Extension" }
    'document' { return "pending-editorial-review/documents/$NameSlug$Extension" }
    default { return "quarantine/$NameSlug$Extension" }
  }
}

if (-not (Test-Path -LiteralPath $Source)) { throw "Source not found: $Source" }
New-Item -ItemType Directory -Force -Path $Reports | Out-Null

$files = Get-ChildItem -LiteralPath $Source -Recurse -Force -File | Sort-Object FullName
$inventory = [Collections.Generic.List[object]]::new()
$renames = [Collections.Generic.List[object]]::new()

foreach ($file in $files) {
  $relative = $file.FullName.Substring($Source.TrimEnd('\\').Length).TrimStart('\\')
  $extension = $file.Extension.ToLowerInvariant()
  $type = Get-ContentType $extension
  $entity = Get-InferredEntity $relative
  $entitySlug = Convert-ToWebSlug $entity
  $nameSlug = Convert-ToWebSlug $file.BaseName
  if (-not $nameSlug) { $nameSlug = 'unnamed-asset' }
  $normalizedName = "$nameSlug$extension"
  $metadata = if ($type -eq 'image') { Get-ImageMetadata $file.FullName $extension } else { @{} }
  $risk = [Collections.Generic.List[string]]::new()
  if ($type -eq 'executable-or-system') { $risk.Add('executable-or-system-file') }
  if ($type -eq 'archive') { $risk.Add('archive-requires-manual-inspection') }
  if ($type -eq 'private-print') { $risk.Add('private-commercial-asset') }
  if ($file.Length -gt 100MB) { $risk.Add('over-100mb') } elseif ($file.Length -gt 50MB) { $risk.Add('over-50mb') }
  if ($metadata.invalid) { $risk.Add('invalid-or-unreadable-image') }
  if ($relative -match '(^|[\\/])(\.env($|\.)|node_modules|\.git|\.next|\.vercel|Thumbs\.db|desktop\.ini)([\\/]|$)') { $risk.Add('excluded-local-or-system-file') }
  $action = switch ($type) {
    'image' { if ($metadata.invalid) { 'BLOCK_AND_REVIEW' } else { 'REVIEW_OPTIMIZE_AND_PUBLISH' } }
    'video' { 'REVIEW_TRANSCODE_POSTER_AND_PUBLISH' }
    'document' { 'EXTRACT_AND_EDITORIAL_REVIEW' }
    'model-3d' { 'VALIDATE_AND_KEEP_PRIVATE_PENDING_APPROVAL' }
    'private-print' { 'KEEP_PRIVATE_METADATA_ONLY' }
    default { 'QUARANTINE_AND_REVIEW' }
  }
  $destination = Get-Recommendation $type $relative $entitySlug $nameSlug $extension
  $entry = [ordered]@{
    originalPath = $file.FullName
    relativePath = $relative
    fileName = $file.Name
    extension = $extension
    sizeBytes = $file.Length
    contentType = $type
    width = $metadata.width
    height = $metadata.height
    durationSeconds = $null
    probableEntity = $entity
    recommendedDestination = $destination
    proposedAction = $action
    risk = @($risk)
    classification = 'NOT_IDENTIFIED'
  }
  $inventory.Add([pscustomobject]$entry)
  if ($file.Name -cne $normalizedName) {
    $renames.Add([pscustomobject][ordered]@{
      originalPath = $file.FullName
      originalName = $file.Name
      normalizedName = $normalizedName
      recommendedDestination = $destination
      requiresReferenceUpdate = $extension -in @('.stl', '.glb', '.3mf', '.cxdlpv4')
    })
  }
}

$inventory | ConvertTo-Json -Depth 8 | Set-Content -Encoding utf8 "$Reports/asterheim-assets-inventory.json"
$renames | ConvertTo-Json -Depth 6 | Set-Content -Encoding utf8 "$Reports/asterheim-assets-renaming-map.json"

$groups = $inventory | Group-Object contentType | Sort-Object Name
$riskCount = @($inventory | Where-Object { $_.risk.Count -gt 0 }).Count
$over50 = @($inventory | Where-Object { $_.sizeBytes -gt 50MB }).Count
$over100 = @($inventory | Where-Object { $_.sizeBytes -gt 100MB }).Count
$invalid = @($inventory | Where-Object { $_.risk -contains 'invalid-or-unreadable-image' }).Count
$markdown = [Collections.Generic.List[string]]::new()
$markdown.Add('# Chronicles of Asterheim asset inventory')
$markdown.Add('')
$markdown.Add("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss K')")
$markdown.Add('')
$markdown.Add("- Source: $Source")
$markdown.Add("- Total files: $($inventory.Count)")
$markdown.Add("- Total bytes: $(($inventory | Measure-Object sizeBytes -Sum).Sum)")
$markdown.Add("- Items with identified risk: $riskCount")
$markdown.Add("- Files over 50 MB: $over50")
$markdown.Add("- Files over 100 MB: $over100")
$markdown.Add("- Unreadable images: $invalid")
$markdown.Add('')
$markdown.Add('## Categories')
$markdown.Add('')
$markdown.Add('| Type | Count | Bytes |')
$markdown.Add('| --- | ---: | ---: |')
foreach ($group in $groups) {
  $markdown.Add("| $($group.Name) | $($group.Count) | $(($group.Group | Measure-Object sizeBytes -Sum).Sum) |")
}
$markdown.Add('')
$markdown.Add('## Inventory')
$markdown.Add('')
$markdown.Add('The complete machine-readable inventory is in `asterheim-assets-inventory.json`. Paths are recorded for audit only; no source asset was copied during this phase.')
$markdown.Add('')
$markdown.Add('| Relative path | Type | Bytes | Dimensions | Entity | Destination | Action | Risk |')
$markdown.Add('| --- | --- | ---: | --- | --- | --- | --- | --- |')
foreach ($item in $inventory) {
  $dimensions = if ($item.width -and $item.height) { "$($item.width)x$($item.height)" } else { 'n/a' }
  $risks = if ($item.risk.Count) { $item.risk -join ', ' } else { 'none' }
  $safeRelative = $item.relativePath.Replace('|', '\|')
  $safeEntity = $item.probableEntity.Replace('|', '\|')
  $markdown.Add("| $safeRelative | $($item.contentType) | $($item.sizeBytes) | $dimensions | $safeEntity | $($item.recommendedDestination) | $($item.proposedAction) | $risks |")
}
$markdown -join "`n" | Set-Content -Encoding utf8 "$Reports/asterheim-assets-inventory.md"

Write-Output ([pscustomobject]@{
  total = $inventory.Count
  bytes = ($inventory | Measure-Object sizeBytes -Sum).Sum
  risks = $riskCount
  over50mb = $over50
  over100mb = $over100
  invalidImages = $invalid
  renameCount = $renames.Count
} | ConvertTo-Json -Compress)
