module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: [
        'https://wt-mechanics-nld8-vnc4b0tpj-z3rks27s-projects.vercel.app', // ✅ dominio de Vercel
        'http://localhost:3000', // opcional para desarrollo local
      ],
      headers: '*',
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
