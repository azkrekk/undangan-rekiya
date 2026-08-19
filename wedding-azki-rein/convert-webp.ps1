# Convert PNG images to WebP format using ImageMagick/GraphicsMagick
# Requires: ImageMagick (convert command) or GraphicsMagick

$imgDir = "wedding-azki-rein/assets/img"
$quality = 75  # WebP quality (0-100)

if (-not (Test-Path $imgDir)) {
    Write-Host "Directory not found: $imgDir"
    exit 1
}

$pngFiles = Get-ChildItem -Path $imgDir -Filter "*.png" -File

if ($pngFiles.Count -eq 0) {
    Write-Host "No PNG files found in $imgDir"
    exit 0
}

Write-Host "Converting PNG to WebP format (quality: $quality)..."
Write-Host "Found $($pngFiles.Count) PNG files`n"

foreach ($file in $pngFiles) {
    $webpPath = [System.IO.Path]::ChangeExtension($file.FullName, ".webp")
    
    try {
        # Try using 'convert' command (ImageMagick)
        if (Get-Command convert -ErrorAction SilentlyContinue) {
            Write-Host "Converting: $($file.Name) -> $([System.IO.Path]::GetFileName($webpPath))"
            & convert "$($file.FullName)" -quality $quality "$webpPath"
        }
        # Fallback to cwebp if available
        elseif (Get-Command cwebp -ErrorAction SilentlyContinue) {
            Write-Host "Converting: $($file.Name) -> $([System.IO.Path]::GetFileName($webpPath))"
            & cwebp -q $quality "$($file.FullName)" -o "$webpPath"
        }
        else {
            Write-Host "ERROR: ImageMagick or WebP tools not found. Install them first:"
            Write-Host "  - ImageMagick: https://imagemagick.org/script/download.php"
            Write-Host "  - or cwebp: https://developers.google.com/speed/webp/download"
            exit 1
        }
        
        if (Test-Path $webpPath) {
            $originalSize = $file.Length / 1KB
            $webpSize = (Get-Item $webpPath).Length / 1KB
            $savings = [math]::Round((1 - ($webpSize / $originalSize)) * 100, 1)
            Write-Host "  ✓ Saved: $([math]::Round($originalSize, 1))KB → $([math]::Round($webpSize, 1))KB ($savings% reduction)`n"
        }
    }
    catch {
        Write-Host "ERROR converting $($file.Name): $_`n"
    }
}

Write-Host "Done! WebP files have been created in $imgDir"
