$orig = [IO.File]::ReadAllText('scratch/wedding-azki-rein/index.html')
$css = [IO.File]::ReadAllText('scratch/new_style.css')
$body = [IO.File]::ReadAllText('scratch/new_body.html')

$headStart = $orig.Substring(0, $orig.IndexOf('<style>') + 7)
$jsStart = $orig.IndexOf('<script>')
$jsEnd = $orig.Substring($jsStart)
$bodyHtml = $body.Split([string[]]@('<script>'), [System.StringSplitOptions]::None)[0]

$newFile = $headStart + "`n" + $css + "`n</style>`n" + $bodyHtml + "`n<script>`n/* PARALLAX SCROLL */`nwindow.addEventListener('scroll', () => { requestAnimationFrame(() => { document.body.style.setProperty('--scrollY', window.scrollY + 'px'); }); });`n" + $orig.Substring($jsStart + 8)

[IO.File]::WriteAllText('scratch/wedding-azki-rein/index.html', $newFile)
