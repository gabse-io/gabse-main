export const experiences = [
  {
    id: 1, title: "Digital Commerce Analyst", company: "KUDOS COMMERCE", companyUrl: "https://www.kudoscommerce.com",
    period: "Nov 2024 - Actual", tech: ["VTEX IO", "Postman", "Checkout API", "Apps Script", "n8n", "VS Code", "Windfurf IDE"],
    preview: "Parametrización funcional de catálogo, checkout y pagos. Desarrollo de custom apps en VTEX IO y automatizaciones que incrementan el ticket promedio y optimizan la experiencia de compra.",
    detail: "Participo activamente en la parametrización funcional del Customer Journey, abarcando catálogo, promociones, checkout, pagos y logística. Incorporo conocimiento en VTEX IO para el desarrollo de custom apps que optimizan la experiencia de compra. Desarrollo soluciones orientadas a incrementar el ticket promedio, mejorar la conversión con estrategias de venta cruzada y adicionales, facilitar la decisión de compra mediante herramientas interactivas, y potenciar la vitrina principal con contenido audiovisual dinámico. Además, desarrollo automatizaciones con Apps Script, n8n, Google Sheets y APIs de VTEX para integrar procesos y mejorar la eficiencia operativa.",
    highlight: "+26% conversión en checkout"
  },
  {
    id: 2, title: "Analista eCommerce", company: "INNEW", companyUrl: "https://innew.net",
    period: "Feb 2023 - Nov 2024", tech: ["VTEX", "APIs REST", "Postman"],
    preview: "Diseño de arquitectura técnica, relevamiento funcional e integración con ERPs/CRMs vía API.",
    detail: "Diseñé la arquitectura técnica de soluciones digitales según el alcance de cada proyecto, liderando el relevamiento funcional para transformar requisitos de negocio en plataformas de venta eficientes. Implementé la configuración end-to-end de la experiencia de compra, abarcando catálogo, precios, promociones, métodos de pago y logística. Gestioné integraciones críticas vía API con sistemas de terceros (ERPs, CRMs), asegurando la correcta operatividad del ecosistema de e-commerce.",
    highlight: "Procesos masivos de actualización vía Postman"
  },
  {
    id: 3, title: "Analista de Ventas - Procesos", company: "CETROGAR", companyUrl: "https://www.cetrogar.com.ar",
    period: "Mar 2021 - Feb 2023", tech: ["Apps Script", "IBM Cognos Analytics", "Excel avanzado"],
    preview: "Elaboración de reportes ejecutivos, gestión de condiciones comerciales y asistencia remota a sucursales.",
    detail: "Confeccioné y actualicé reportes de ventas estratégicos para Gerencia y Directorio, desarrollando habilidades en análisis de datos y visualización de métricas clave. Gestioné las condiciones comerciales de la empresa, asegurando su correcta aplicación y comunicación. Brindé asistencia remota a sucursales sobre temas comerciales vigentes, fortaleciendo mi capacidad de soporte y trabajo en equipo. Esta experiencia me permitió ampliar mi visión del negocio y comprender en profundidad los procesos comerciales que luego apliqué en entornos de e-commerce.",
    highlight: "Dashboard ejecutivos interactivos con Excel"
  },
  {
    id: 4, title: "Operador E-commerce", company: "TOPMEGA|BMC|FORTE", companyUrl: "https://lopezhnos.com.ar",
    period: "Ago 2019 - Mar 2021", tech: ["Vtex", "Tango", "Microsoft Dynamics AX"],
    preview: "Gestión multicanal y automatización de stock.",
    detail: "Administré los diversos canales de comercialización (Mercado Libre, Topmega, Forte, BMC, Linio, Tienda Naranja), realizando actualización y gestión de stock en todas las plataformas. Realicé análisis de competencia y fijación de precios para mantener la competitividad del negocio. Procesé y facturé órdenes de compra, asegurando el correcto flujo de ventas. Esta experiencia fue mi primer contacto con VTEX (versión legacy), donde comprendí los fundamentos del e-commerce que luego apliqué y profundicé con VTEX IO.",
    highlight: "Optimización de stock y precios con tablas dinámicas avanzadas"
  }
];

export const ownProjects = [
  {
    id: 1,
    title: "BARBERS - Sistema de Turnos",
    icon: "fas fa-calendar-check",
    description: "Sistema completo de reservas con Google Calendar, Sheets, Mercado Pago, notificaciones email y panel admin.",
    tech: ["Apps Script", "Google Calendar API", "Google Sheets", "GmailApp", "Mercado Pago"],
    detailDescription: "Sistema integral de gestión de turnos desarrollado íntegramente con Google Apps Script. Permite a los clientes reservar turnos online seleccionando barbero, servicios múltiples, fecha y horario en tiempo real. El backend se sincroniza con Google Calendar (un calendario por barbero) y Google Sheets como base de datos. Incluye un sistema de pre-reserva con seña vía Mercado Pago, notificaciones automáticas por email y un panel de administración completo para gestionar barberos, servicios, configuración y turnos.",
    advantages: [
      "Sin costos de infraestructura — corre 100% sobre Google Workspace",
      "Sincronización en tiempo real con Google Calendar",
      "Panel admin con autenticación segura y gestión CRUD completa",
      "Sistema de seña vía Mercado Pago antes de confirmar",
      "Notificaciones automáticas por email (pre-reserva y confirmación)",
      "Invitaciones a Google Calendar integradas",
      "Configuración dinámica desde Sheets (sin tocar código)",
      "Responsive design optimizado para mobile",
      "Multi-barbero y multi-servicio con precios configurables",
      "Filtros de búsqueda y estadísticas en panel admin"
    ],
    mockups: [
      { id: 'form', label: 'Formulario de Reserva', color: '#111' },
      { id: 'calendar', label: 'Selector de Fecha', color: '#1a1a1a' },
      { id: 'success', label: 'Confirmación y Pago', color: '#0a0a0a' },
      { id: 'admin', label: 'Panel Administrativo', color: '#0d0d0d' }
    ]
  },
  { id: 2, title: "VTEX Bulk Updater", icon: "fas fa-database", description: "Actualización masiva de SKUs, precios y stock desde Google Sheets a VTEX.", tech: ["Apps Script", "VTEX API", "Google Sheets"] },
  { id: 3, title: "n8n Middleware Hub", icon: "fas fa-diagram-project", description: "Workflows n8n para sincronización entre VTEX OMS y ERPs.", tech: ["n8n", "Cloudflare Workers", "Webhooks"] },
  { id: 4, title: "Cloudflare Edge Config", icon: "fas fa-cloud", description: "Reglas de caché y Workers para optimizar rendimiento headless.", tech: ["Cloudflare Workers", "Cache Rules", "Performance"] },
  { id: 5, title: "Windsurf Component Library", icon: "fab fa-react", description: "Componentes React reutilizables para VTEX IO.", tech: ["React", "VTEX IO", "Windsurf IDE"] },
  { id: 6, title: "Apps Script Automation Suite", icon: "fab fa-google", description: "Suite de automatizaciones para conciliación bancaria.", tech: ["Apps Script", "VTEX Payments", "Drive API"] }
];

export const typingTexts = [
  "> VTEX Specialist Architect · 6+ años de experiencia",
  "> n8n · Apps Script · Cloudflare · Windsurf IDE",
  "> +50 proyectos de implementación en VTEX IO",
  "> Custom automation workflows · Automatización a medida"
];
