// Renders album.html?id=<key> from window.albumsData
(function () {
  const root = document.getElementById('album-root');
  const data = window.albumsData || {};
  const id = new URLSearchParams(window.location.search).get('id');
  const album = id && Object.prototype.hasOwnProperty.call(data, id) ? data[id] : null;

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function section(title, className) {
    const s = el('section', 'album-section ' + (className || ''));
    s.appendChild(el('h2', 'album-section-title', title));
    return s;
  }

  // Returns { src, width, height } for a valid Bandcamp embed, or null.
  function parseBandcamp(value) {
    const raw = (value || '').trim();
    if (!raw) return null;

    let src = raw;
    let width = '';
    let height = '';

    if (raw.charAt(0) === '<') {
      const doc = new DOMParser().parseFromString(raw, 'text/html');
      const frame = doc.querySelector('iframe');
      if (!frame) return null;
      src = frame.getAttribute('src') || '';
      width = frame.getAttribute('width') || frame.style.width || '';
      height = frame.getAttribute('height') || frame.style.height || '';
    }

    let url;
    try {
      url = new URL(src);
    } catch (e) {
      return null;
    }
    const host = url.hostname.toLowerCase();
    const isBandcamp = host === 'bandcamp.com' || host.endsWith('.bandcamp.com');
    if (url.protocol !== 'https:' || !isBandcamp) return null;

    const size = v => (/^\d+(\.\d+)?(px|%)?$/.test(v) ? (/[a-z%]$/.test(v) ? v : v + 'px') : '');
    return {
      src: url.href,
      width: size(width.trim()) || '350px',
      height: size(height.trim()) || '470px'
    };
  }

  if (!album) {
    document.title = 'CARLOS / ÁLBUM NO ENCONTRADO';
    const box = el('section', 'album-section album-notfound');
    box.appendChild(el('p', 'album-paragraph', 'No se encontró el álbum solicitado.'));
    const back = el('a', 'nav-link', 'Volver a Álbumes');
    back.href = 'albumes.html';
    box.appendChild(back);
    root.appendChild(box);
    return;
  }

  const fullTitle = `${album.title} (${album.year})`;
  document.title = `CARLOS / ${fullTitle}`;

  // Connector lines (drawn over the page, positioned by connectHero below)
  const NS = 'http://www.w3.org/2000/svg';
  const lines = document.createElementNS(NS, 'svg');
  lines.setAttribute('class', 'album-lines');
  lines.setAttribute('aria-hidden', 'true');
  lines.setAttribute('focusable', 'false');
  root.appendChild(lines);

  // Hero: [title box -> cover box] on the left, text column on the right
  const hero = el('section', 'album-hero');
  const side = el('div', 'album-side');

  const titleBox = el('h2', 'album-title-box', fullTitle);
  titleBox.id = 'album-title-box';

  const coverBox = el('div', 'album-cover');
  coverBox.id = 'album-cover-box';
  const cover = el('img');
  cover.src = album.cover;
  cover.alt = `Tapa de ${fullTitle}`;
  cover.decoding = 'async';
  coverBox.appendChild(cover);

  side.appendChild(titleBox);
  side.appendChild(coverBox);

  const textCol = el('div', 'album-text');
  (Array.isArray(album.text) ? album.text : [album.text || '']).forEach(p => {
    if (p) textCol.appendChild(el('p', 'album-paragraph', p));
  });

  hero.appendChild(side);
  hero.appendChild(textCol);
  root.appendChild(hero);

  connectHero();

  // Albumes (nav) -> title box (diagonal), title box -> cover box (vertical)
  function connectHero() {
    const nav = document.getElementById('nav-albumes');
    if (!nav) return;

    const make = () => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('class', 'connection-line');
      lines.appendChild(p);
      return p;
    };
    const navLine = make();
    const coverLine = make();

    const point = (rect, side, origin) => {
      const x = rect.left - origin.left;
      const y = rect.top - origin.top;
      if (side === 'right') return { x: x + rect.width, y: y + rect.height / 2 };
      if (side === 'top') return { x: x + rect.width / 2, y };
      return { x: x + rect.width / 2, y: y + rect.height }; // bottom
    };
    const path = (a, b) =>
      `M ${Math.round(a.x)} ${Math.round(a.y)} L ${Math.round(b.x)} ${Math.round(b.y)}`;

    const update = () => {
      const origin = root.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      const t = titleBox.getBoundingClientRect();
      const c = coverBox.getBoundingClientRect();
      navLine.setAttribute('d', path(point(n, 'right', origin), point(t, 'top', origin)));
      coverLine.setAttribute('d', path(point(t, 'bottom', origin), point(c, 'top', origin)));
    };

    let frame = null;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => { frame = null; update(); });
    };

    update();
    window.addEventListener('load', update);
    window.addEventListener('resize', schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(schedule);
      ro.observe(root);
      ro.observe(document.body);
    }
    if (!cover.complete) cover.addEventListener('load', schedule, { once: true });
  }

  // Bandcamp embed (right after the text, before videos and photos).
  // Accepts a pasted <iframe> embed code or a bare bandcamp.com URL.
  // Only src/width/height are read from it; no pasted HTML is inserted.
  if (typeof album.bandcamp === 'string') {
    const s = section('Escuchar');
    const embed = parseBandcamp(album.bandcamp);
    const frame = el('div', 'bandcamp-frame');
    if (embed) {
      const iframe = document.createElement('iframe');
      iframe.src = embed.src;
      iframe.title = `Bandcamp: ${fullTitle}`;
      iframe.loading = 'lazy';
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('seamless', '');
      iframe.style.width = embed.width;
      iframe.style.height = embed.height;
      frame.appendChild(iframe);
    } else {
      frame.classList.add('bandcamp-empty');
      frame.appendChild(el('span', '', 'Reproductor de Bandcamp próximamente'));
    }
    s.appendChild(frame);
    root.appendChild(s);
  }

  // Videos
  if (album.videos && album.videos.length) {
    const s = section('Videos');
    const grid = el('div', 'video-grid');
    album.videos.forEach(v => {
      const frame = el('div', 'video-frame');
      if (v.youtubeId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.youtubeId)}`;
        iframe.title = v.title || 'Video';
        iframe.loading = 'lazy';
        iframe.allow = 'accelerometer; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        iframe.setAttribute('frameborder', '0');
        frame.appendChild(iframe);
      } else {
        frame.classList.add('video-empty');
        frame.appendChild(el('span', '', 'Video próximamente'));
      }
      grid.appendChild(frame);
    });
    s.appendChild(grid);
    root.appendChild(s);
  }

  // Related photos
  if (album.gallery && album.gallery.length) {
    const s = section('Fotos');
    const grid = el('div', 'photo-grid');
    album.gallery.forEach(photo => {
      const box = el('figure', 'photo-item');
      const img = el('img');
      img.src = photo.src;
      img.alt = photo.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      box.appendChild(img);
      grid.appendChild(box);
    });
    s.appendChild(grid);
    root.appendChild(s);
  }

  // Press
  if (album.press && album.press.length) {
    const s = section('Prensa');
    const list = el('ul', 'press-list');
    album.press.forEach(item => {
      const li = el('li', 'press-item');
      const a = el('a', 'press-link', item.title);
      a.href = item.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.appendChild(a);
      if (item.outlet) li.appendChild(el('span', 'press-outlet', item.outlet));
      list.appendChild(li);
    });
    s.appendChild(list);
    root.appendChild(s);
  }
})();
