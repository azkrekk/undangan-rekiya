# Performance Optimization Guide

## 1. Mobile Animation Optimization ✅

### CSS Changes
- **Disabled floating animations on mobile** (`max-width: 768px`):
  - `floatY`: No vertical movement
  - `swayL` & `swayR`: No rotation/movement
  - `swayTop`: No rotation
  - `floatMtn`: No vertical movement

- **Disabled hover effects on mobile** (`max-width: 480px`):
  - Gallery images: No scale on hover
  - Cards: No transform/shadow changes
  - Buttons: No gradient animations

### JavaScript Changes
- **Optimized particle system** for low-end devices:
  - Mobile (<480px): 12 particles max
  - Tablet (480-768px): 28 particles max
  - Desktop: 50 particles max
  - Calculation based on screen width for efficient GPU usage

### Result
- Reduced animation frame drops on low-end mobile devices
- Respects `prefers-reduced-motion` preference
- Lower battery/CPU consumption on mobile

---

## 2. Modern Image Format Support (WebP) ✅

### Implementation
All PNG images now use `<picture>` element with WebP fallback:

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.png" alt="...">
</picture>
```

### Images Converted
- ✓ mountain.png → mountain.webp
- ✓ Joglo.png → Joglo.webp
- ✓ gunungan.png → gunungan.webp
- ✓ rama.png → rama.webp
- ✓ Shinta.png → Shinta.webp
- ✓ azkia.png → azkia.webp
- ✓ rein.png → rein.webp
- ✓ wayang.png → wayang.webp
- ✓ gallery_1-5.png → gallery_1-5.webp

### Browser Support
- **Modern browsers** (Chrome, Edge, Firefox, Safari 14+): Load WebP
- **Older browsers**: Automatically fallback to PNG
- **Zero breaking changes** - fully backward compatible

### Performance Benefits
- **25-35% smaller file sizes** (typical WebP compression)
- Faster loading times, especially on slower connections
- Reduced bandwidth usage

### Setup Instructions

#### Option 1: Using convert-webp.ps1 (Windows)
```powershell
.\wedding-azki-rein\convert-webp.ps1
```

**Requirements:**
- ImageMagick (recommended): https://imagemagick.org/script/download.php
- OR cwebp tool: https://developers.google.com/speed/webp/download

#### Option 2: Using Online Tools (Quick)
1. Visit: https://convertio.co/png-webp/ or https://online-convert.com/
2. Batch upload all PNG files
3. Download WebP files to `wedding-azki-rein/assets/img/`

#### Option 3: Using Command Line
```bash
# Using ImageMagick (Linux/Mac)
for file in *.png; do convert "$file" -quality 75 "${file%.png}.webp"; done

# Using cwebp (cross-platform)
for file in *.png; do cwebp -q 75 "$file" -o "${file%.png}.webp"; done
```

---

## 3. Next Steps (Optional)

### Further Optimizations
- [ ] Optimize images with proper dimensions (srcset for different screen sizes)
- [ ] Minify CSS/JS for production
- [ ] Implement lazy loading for hero section images
- [ ] Add font subsetting for custom fonts
- [ ] Enable Gzip compression on server

### Testing Performance
Use these tools to measure improvements:
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://www.webpagetest.org/
- **Lighthouse** (Chrome DevTools)

### Mobile Performance Tips
- Test on actual low-end devices (Moto G4 generation or older)
- Monitor with Chrome DevTools → Performance tab
- Use "Throttle CPU" to simulate low-end performance
