/**
 * Events disponibles para configurar en Google Tag Manager:
 *
 * ┌─────────────────────┬──────────────────────────────────────────────┐
 * │ event               │ Cuándo se dispara                            │
 * ├─────────────────────┼──────────────────────────────────────────────┤
 * │ outbound_link       │ Click a link externo (LinkedIn, empresa,     │
 * │                     │ email, WhatsApp)                             │
 * │                     │ → label: "linkedin_profile" / "company_web"  │
 * │                     │   / "email" / "whatsapp"                     │
 * ├─────────────────────┼──────────────────────────────────────────────┤
 * │ toggle_detail       │ Expandir/colapsar detalle de experiencia     │
 * │                     │ → label: nombre de la empresa                │
 * │                     │ → value: 1 (expandir) / 0 (colapsar)         │
 * ├─────────────────────┼──────────────────────────────────────────────┤
 * │ carousel_nav        │ Navegación en carrusel de proyectos          │
 * │                     │ → label: "prev" / "next"                     │
 * ├─────────────────────┼──────────────────────────────────────────────┤
 * │ hero_cta            │ Click en botón "Conectar en LinkedIn"        │
 * ├─────────────────────┼──────────────────────────────────────────────┤
 * │ scroll_depth        │ Profundidad de scroll alcanzada             │
 * │                     │ → label: "25%" / "50%" / "75%" / "100%"     │
 * ├─────────────────────┼──────────────────────────────────────────────┤
 * │ section_view        │ Sección visible en viewport                  │
 * │                     │ → label: "hero" / "timeline" / "projects"    │
 * │                     │   / "footer"                                 │
 * └─────────────────────┴──────────────────────────────────────────────┘
 */

function getDataLayer() {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

export function trackEvent(action, category, label, value) {
  try {
    const dl = getDataLayer();
    dl.push({
      event: action,
      category: category || 'engagement',
      label: label || '',
      value: value != null ? value : undefined,
    });
  } catch (e) {
    // Silently fail — analytics no debe romper el sitio
  }
}
