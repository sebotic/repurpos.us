// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  site_name: "ReframeDB",
  description: "ReframeDB is an open and extendable drug repurposing database and screening set of over 12,000 compounds",
  api_url: 'http://localhost:8000/api', //'https://reframedb.org/api',
  host_url: 'http://localhost/', //'https://reframedb.org/',
  url: 'http://localhost/',
  googleAnalyticsKey: ''
};
