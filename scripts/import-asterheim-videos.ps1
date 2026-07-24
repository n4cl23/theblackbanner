param(
  [string]$InventoryPath = "reports/asterheim-assets-inventory.json",
  [string]$ImageManifestPath = "src/content/asterheim-media-manifest.generated.json"
)

$utf8 = New-Object System.Text.UTF8Encoding($false)
$inventory = [IO.File]::ReadAllText((Resolve-Path $InventoryPath), [Text.Encoding]::UTF8) | ConvertFrom-Json
$images = [IO.File]::ReadAllText((Resolve-Path $ImageManifestPath), [Text.Encoding]::UTF8) | ConvertFrom-Json
$shell = New-Object -ComObject Shell.Application

function ConvertTo-Slug([string]$Value) {
  $normalized = $Value.Normalize([Text.NormalizationForm]::FormD)
  $builder = New-Object Text.StringBuilder
  foreach ($character in $normalized.ToCharArray()) {
    if ([Globalization.CharUnicodeInfo]::GetUnicodeCategory($character) -ne [Globalization.UnicodeCategory]::NonSpacingMark) {
      [void]$builder.Append($character)
    }
  }
  return (($builder.ToString().ToLowerInvariant() -replace '[^a-z0-9]+','-').Trim('-'))
}

function Get-ShortHash([string]$Value) {
  $sha = [Security.Cryptography.SHA256]::Create()
  try { return ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($Value))).Replace('-','').ToLowerInvariant()).Substring(0,8) }
  finally { $sha.Dispose() }
}

$results = New-Object Collections.Generic.List[object]
foreach ($video in @($inventory | Where-Object extension -eq '.mp4')) {
  $folder = $shell.Namespace((Split-Path $video.originalPath))
  $item = $folder.ParseName((Split-Path $video.originalPath -Leaf))
  $durationText = $folder.GetDetailsOf($item, 27)
  $widthText = $folder.GetDetailsOf($item, 316)
  $heightText = $folder.GetDetailsOf($item, 314)
  $valid = $durationText -and $widthText -and $heightText
  if (-not $valid) {
    $results.Add([pscustomobject]@{ sourcePath=$video.relativePath; status='quarantined'; reason='missing-video-metadata' })
    continue
  }
  $entitySlug = ConvertTo-Slug $video.probableEntity
  $base = ConvertTo-Slug ([IO.Path]::GetFileNameWithoutExtension($video.fileName))
  $hash = Get-ShortHash $video.relativePath
  $name = "$base-$hash.mp4"
  $relative = "media/asterheim/entities/$entitySlug/$name"
  $destination = Join-Path 'public' ($relative -replace '/', '\')
  New-Item -ItemType Directory -Force -Path (Split-Path $destination) | Out-Null
  Copy-Item -LiteralPath $video.originalPath -Destination $destination -Force
  $duration = [TimeSpan]::Parse($durationText).TotalSeconds
  $poster = @($images | Where-Object entitySlug -eq $entitySlug | Select-Object -First 1)[0].src
  $results.Add([pscustomobject]@{
    id = "video-$entitySlug-$hash"
    type = 'video'
    src = "/$relative"
    poster = $poster
    alt = "Video de $($video.probableEntity) no arquivo de Asterheim"
    caption = 'Video importado; descricao editorial pendente de revisao.'
    credit = 'The Black Banner - Chronicles of Asterheim'
    width = [int]($widthText -replace '[^0-9]','')
    height = [int]($heightText -replace '[^0-9]','')
    duration = $duration
    locale = 'und'
    entityType = if ($video.relativePath -match 'Beasts of Asterheim') {'creature'} elseif ($video.relativePath -match 'Legends of the Realm') {'guardian'} else {'character'}
    entitySlug = $entitySlug
    usage = 'gallery'
    status = 'review'
    sourcePath = $video.relativePath
    bytes = $video.sizeBytes
  })
}

$manifest = @($results | Where-Object status -eq 'review' | Select-Object id,type,src,poster,alt,caption,credit,width,height,duration,locale,entityType,entitySlug,usage,status)
[IO.File]::WriteAllText((Join-Path (Get-Location) 'src/content/asterheim-video-manifest.generated.json'), (($manifest | ConvertTo-Json -Depth 6) + "`n"), $utf8)
[IO.File]::WriteAllText((Join-Path (Get-Location) 'reports/asterheim-videos.json'), (($results | ConvertTo-Json -Depth 6) + "`n"), $utf8)
@{ reviewed=$results.Count; imported=$manifest.Count; quarantined=@($results | Where-Object status -eq 'quarantined').Count } | ConvertTo-Json -Compress
