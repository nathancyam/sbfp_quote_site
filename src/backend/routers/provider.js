const Router = require('express').Router;

function RouterBuilder(middlewareRegistry, dependencyRegistry) {

  return (routerCtor) => {
    const router = Router();
    const { middleware, dependencies } = routerCtor;
    let routerMiddlewares = [];
    let routerDependencies = [];

    if (middleware) {
      routerMiddlewares = middleware.map(alias => middlewareRegistry[alias]);
      routerMiddlewares.forEach(middleware => router.use(middleware));
    }

    if (dependencies) {
      routerDependencies = dependencies.map(alias => dependencyRegistry[alias]);
    }

    return routerCtor(router, ...routerDependencies);
  }
}

module.exports = RouterBuilder;
