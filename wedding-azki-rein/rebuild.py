import re

with open('wedding-azki-rein/index.html', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('scratch/new_style.css', 'r', encoding='utf-8') as f:
    css = f.read()

with open('scratch/new_body.html', 'r', encoding='utf-8') as f:
    body = f.read()

head_start = orig[:orig.find('<style>') + 7]

js_start = orig.find('<script>')
if js_start == -1:
    print("Script block not found!")
    exit(1)
js_end = orig[js_start:]

body_html = body.split('<script>')[0]

new_file = head_start + "\n" + css + "\n</style>\n" + body_html + "\n<script>\n" + "/* ─────────────────────────────────────────────\n   PARALLAX SCROLL JS\n───────────────────────────────────────────── */\nwindow.addEventListener('scroll', () => { requestAnimationFrame(() => { document.body.style.setProperty('--scrollY', window.scrollY + 'px'); }); });\n" + orig[js_start + 8:]

with open('wedding-azki-rein/index.html', 'w', encoding='utf-8') as f:
    f.write(new_file)

print("Rebuild success!")
