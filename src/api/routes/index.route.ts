import { Router } from 'express';
import DeviceRoute from './device.route';
import ErrorLogRoute from './errorLog.route';
import DeviceSyncroute from './sync.route';

export interface Routes {
  path?: string;
  router: Router;
}

class IndexRoute implements Routes {
  public path = '/';
  public router = Router();

  private routes: Routes[] = [
    new DeviceRoute(),
    new ErrorLogRoute(),
    new DeviceSyncroute()
  ];

  constructor() {
    this.initializeRoutes();
  }

   private initializeRoutes() {
    this.routes.forEach(route => {
      this.router.use('/', route.router);
    });
  }
}

export default IndexRoute;
