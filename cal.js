// Cal.com — calendrier ouvert au clic sur les boutons de rendez-vous.
(function (C, A, L) {
  const p = function (a, ar) { a.q.push(ar); };
  const d = C.document;
  C.Cal = C.Cal || function () {
    const cal = C.Cal;
    const ar = arguments;
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const script = d.createElement("script");
      script.src = A;
      script.async = true;
      script.onerror = () => {
        // Keep booking reachable even when the embed is blocked.
        window.location.assign("https://cal.com/walydnafi/30min");
      };
      d.head.appendChild(script);
      cal.loaded = true;
    }
    if (ar[0] === L) {
      const api = function () { p(api, arguments); };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        cal.ns[namespace] = cal.ns[namespace] || api;
        p(cal.ns[namespace], ar);
        p(cal, ["initNamespace", namespace]);
      } else p(cal, ar);
      return;
    }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");

let bookingInitialized = false;
function initializeBooking() {
  if (bookingInitialized) return;
  bookingInitialized = true;
  Cal("init", "30min", { origin: "https://app.cal.com" });
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;
  Cal.ns["30min"]("ui", { hideEventTypeDetails: false, layout: "month_view" });
}
// Load only on explicit booking activation. Queue the very first click as well.
document.addEventListener('click', event => {
  const button = event.target instanceof Element ? event.target.closest('[data-cal-link]') : null;
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  initializeBooking();
  let config = {};
  try { config = JSON.parse(button.dataset.calConfig || '{}'); } catch (_) {}
  Cal.ns[button.dataset.calNamespace || '30min']('modal', {
    calLink: button.dataset.calLink,
    config
  });
}, true);
