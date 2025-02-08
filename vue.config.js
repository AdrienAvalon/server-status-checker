module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // Servir le fichier YAML
      devServer.app.get('/servers.yaml', (req, res) => {
        res.sendFile(`${__dirname}/servers.yaml`);
      });

      return middlewares;
    },
  },
};