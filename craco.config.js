const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#ed4d2d",
              "@btn-primary-bg": "#ed4d2d",
              "@border-radius-base": "4px",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
