const PROXY_CONFIG = [
  {
    "context": [
      "/api",
      "/api/search",
      "/api/data",
      "/api/assay_details",
      "/api/assay_list",
      "/api/auth/login/",
      "/api/auth/status/",
      "/api/auth/register",
      "/api/auth/reset_pass/check",
      "/api/auth/reset_pass/link",
      "/api/auth/reset_pass",
      "/api/auth/reset_pass/link",
      "/api/auth/confirm",
      "/api/auth/confirm/link",
      "/api/compound_svg",


    ],
    "target": "http://localhost:8000",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }
  }
]

module.exports = PROXY_CONFIG;
