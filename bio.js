// Bio page connectors.
// Inicio -> junction (diagonal, from the middle of Inicio to the middle-left of
// the Biografia row). The junction is the point where the vertical spine meets
// Biografia's connector. "Descargar" joins the same spine above it, and the other
// subtitles join it below, so everything connects through Biografia.
(function () {
  const main = document.querySelector('.bio-main');
  const svg = document.querySelector('.bio-lines');
  const column = document.querySelector('.bio-column');
  const inicio = document.getElementById('nav-inicio');
  const download = document.getElementById('bio-download');
  const title = document.getElementById('bio-title');
  if (!main || !svg || !column || !inicio || !download || !title) return;

  const NS = 'http://www.w3.org/2000/svg';
  const diagonal = document.createElementNS(NS, 'path');
  diagonal.classList.add('connection-line');
  svg.appendChild(diagonal);

  function update() {
    const origin = main.getBoundingClientRect();
    const colRect = column.getBoundingClientRect();
    const i = inicio.getBoundingClientRect();
    const t = title.getBoundingClientRect();
    const d = download.getBoundingClientRect();

    // Junction: spine x (column left edge), vertical middle of Biografia
    const jx = colRect.left - origin.left;
    const jy = t.top - origin.top + t.height / 2;
    // Inicio: right edge, vertical middle
    const sx = i.right - origin.left;
    const sy = i.top - origin.top + i.height / 2;

    diagonal.setAttribute('d', `M ${Math.round(sx)} ${Math.round(sy)} L ${Math.round(jx)} ${Math.round(jy)}`);

    // Spine starts at the middle of the Descargar node
    column.style.setProperty('--spine-top', `${Math.round(d.top - colRect.top + d.height / 2)}px`);
  }

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
    ro.observe(main);
    ro.observe(document.body);
  }
  document.querySelectorAll('.bio-column img').forEach(img => {
    if (!img.complete) img.addEventListener('load', schedule, { once: true });
  });
})();
