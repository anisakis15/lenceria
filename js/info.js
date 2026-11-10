/* ==========================================================
   DALIA · js/info.js
   Solo la página Info: slideshows y preguntas frecuentes.
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
    speed: 800,
  };
  new Splide("#slideshow-1", { ...base, interval: 2000 }).mount();
  new Splide("#slideshow-2", { ...base, interval: 2000 }).mount();
  new Splide("#slideshow-3", { ...base, interval: 2000 }).mount();

  // ---------- Preguntas frecuentes: animación de altura con ease-in-out ----------
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("details").forEach((el) => {
    const summary = el.querySelector("summary");
    let isOpen = el.open;
    let anim = null;

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      isOpen = !isOpen;
      el.classList.toggle("is-open", isOpen);

      // Sin animación si la persona prefiere menos movimiento
      if (reduceMotion) {
        el.open = isOpen;
        return;
      }

      // Altura actual (también vale si se pulsa a mitad de animación)
      const start = el.offsetHeight;
      if (anim) anim.cancel();

      // Mide la altura abierta y la cerrada
      el.open = true;
      const openH = el.offsetHeight;
      el.open = false;
      const closedH = el.offsetHeight;
      el.open = true;

      el.style.overflow = "hidden";
      anim = el.animate(
        { height: [start + "px", (isOpen ? openH : closedH) + "px"] },
        { duration: 350, easing: "ease-in-out" },
      );
      anim.onfinish = () => {
        el.open = isOpen;
        el.style.overflow = "";
        anim = null;
      };
    });
  });
})();
