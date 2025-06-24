module.exports = {
  'strapi-neon-tech-db-branches': {
    enabled: true,
    config: {
      neonApiKey: "napi_g172ul0pv72569irx5hl22axzyjt55xqsk6pw2kg5kfrpcotzf23fkmymp4bcupp", // get it from here: https://console.neon.tech/app/settings/api-keys
      neonProjectName: "wt-mechanics", // the neon project under wich your DB runs
      neonRole: "neondb_owner", // create it manually under roles for your project first
      gitBranch: "main", // branch can be pinned via this config option. Will not use branch from git then. Usefull for preview/production deployment
    }
  },
}