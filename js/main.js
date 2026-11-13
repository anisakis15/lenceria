/* ==========================================================
   DALIA · js/main.js
   JavaScript común a las 5 páginas.
   Se enlaza al final del <body> de cada página:
     <script src="js/main.js"></script>
   ========================================================== */
(() => {
  const root = document.documentElement;
  const header = document.getElementById("site-header");
  const logo = document.getElementById("site-logo");
  const footer = document.getElementById("site-footer");
  const mqDesk = matchMedia("(min-width: 768px)");
  const mqHover = matchMedia("(hover: hover) and (pointer: fine)");

  // ---------- 1. Medidas que usa el CSS (--hh, --fh, --ft-top) ----------
  // <body data-hh="0.76"> fija qué parte de la altura del menú cuenta
  // (Medias, Sujetadores y Contacto: la media de la página actual está bajada).
  // Sin ese atributo (Index e Info): el 52% si hay ratón (medias recogidas)
  // y el 100% en táctil.
  const fixed = parseFloat(document.body.dataset.hh);

  const measure = () => {
    const f = Number.isNaN(fixed) ? (mqHover.matches ? 0.52 : 1) : fixed;
    root.style.setProperty("--hh", header.offsetHeight * f + "px");
    root.style.setProperty(
      "--fh",
      mqDesk.matches ? "0px" : logo.offsetHeight + "px",
    );
    // Altura de referencia del footer: hasta donde llegan las medias bajadas
    root.style.setProperty("--ft-top", header.offsetHeight * 0.76 + "px");
  };
  measure();
  addEventListener("resize", measure);
  mqDesk.addEventListener("change", measure);
  new ResizeObserver(measure).observe(header);
  new ResizeObserver(measure).observe(logo);

  // ---------- 2. Móvil: el logo sube cuando el footer ocupa el 35% inferior ----------
  new IntersectionObserver(
    ([e]) => document.body.classList.toggle("footer-in", e.isIntersecting),
    { rootMargin: "0px 0px -35% 0px" },
  ).observe(footer);

  // ---------- 3. Botón claro / oscuro (la clase "dark" activa las variantes dark:) ----------
  const btn = document.getElementById("theme-toggle");
  const sync = () => {
    const dark = root.classList.contains("dark");
    btn.setAttribute("aria-pressed", dark);
    btn.querySelector('[data-mode="dark"]').classList.toggle("on", dark);
    btn.querySelector('[data-mode="light"]').classList.toggle("on", !dark);
  };
  btn.addEventListener("click", () => {
    const dark = root.classList.toggle("dark");
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (e) {}
    sync();
  });
  sync();
})();
