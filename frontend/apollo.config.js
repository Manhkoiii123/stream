/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv/config");
module.exports = {
  service: {
    endpoint: {
      url: process.env.NEXT_PUBLIC_SERVER_URL,
      skipSSLValidation: true,
    },
  },
};
