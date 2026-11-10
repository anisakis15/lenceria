/* ==========================================================
   DALIA · js/index.js
   Solo la portada: slideshows y subida del logo en escritorio.
   Necesita Splide cargado ANTES (script del CDN).
   ========================================================== */
(() => {
  // ---------- Slideshows independientes, sin flechas ni puntos ----------
  const base = {
    type: "fade",
    rewind: true,
    arrows: false,
    pagination: false,
    drag: false,
    autoplay: true,
    pauseOnHover: false,
    pauseOnFocus: false,
    speed: 1200,
  };
  new Splide("#slideshow-a", { ...base, interval: 2000 }).mount();
  new Splide("#slideshow-b", { ...base, interval: 2000 }).mount();

  // ---------- Coreografía del logo (escritorio) ----------
  const root = document.documentElement;
  const header = document.getElementById("site-header");
  const logo = document.getElementById("site-logo");
  const logoImg = document.getElementById("site-logo-img");
  const mqDesk = matchMedia("(min-width: 768px)");

  const PHASE = 0.7; // el logo tarda 70% de la altura de pantalla en subir
  let L = 0,
    y0 = 0,
    yEnd = 0,
    sEnd = 1;

  function measure() {
    const vh = innerHeight,
      vw = innerWidth,
      desk = mqDesk.matches;
    L = desk ? vh * PHASE : 0;
    root.style.setProperty("--L", L + "px");

    if (desk) {
      const h0 = logo.offsetHeight,
        w0 = logoImg.offsetWidth;
      y0 = vh - h0 - 16; // posición inicial: abajo
      yEnd = vh * 0.04; // posición final: arriba
      sEnd = Math.min(Math.max(vw * 0.16, 180), 340) / w0; // ancho final del logo
    }
    update();
  }

  function update() {
    if (!mqDesk.matches) {
      logo.style.transform = "";
      return;
    }
    const p = Math.min(1, Math.max(0, scrollY / L));
    logo.style.transform = `translate3d(0,${y0 + (yEnd - y0) * p}px,0) scale(${1 + (sEnd - 1) * p})`;
  }

  let ticking = false;
  addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    },
    { passive: true },
  );
  addEventListener("resize", measure);
  mqDesk.addEventListener("change", measure);
  new ResizeObserver(measure).observe(header);

  const setRatio = () => {
    root.style.setProperty(
      "--logo-r",
      logoImg.naturalWidth / logoImg.naturalHeight,
    );
    measure();
  };
  logoImg.complete ? setRatio() : logoImg.addEventListener("load", setRatio);
  measure();
})();
