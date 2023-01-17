import http from 'node:http'
import EventEmitter from 'node:events';
import { Router } from '../routers/router';
import { parseRouter } from '../helper/parseRoute';


export class Application {
  server: http.Server;
  emitter: EventEmitter;
  middlewares: any[];

  constructor() {
    this.emitter = new EventEmitter();
    this.server = this.createHttpServer();
    this.middlewares = [];
  }

  public listen(port: string | number, callback: any): void {
    this.server.listen(port, callback);
  }

  public use(middleware: any): void {
    this.middlewares.push(middleware);
  }

  public route(router: Router): void {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint: any = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(`${path}:${method}`, (req, res) => {
          const handler = endpoint[method];
          handler(req, res);
        });
      });
    });
  }

  private createHttpServer(): http.Server {
    return http.createServer((req: any, res: any) => {
      let body = '';

      req.on('data', (chunk: any) => {
        body += chunk;
      });

      req.on('end', () => {
        if (body) {
          req.body = JSON.parse(body);
        }

        this.middlewares.forEach((middleware) => middleware(req, res));
        parseRouter(req, this.emitter);        

        if (!req.eventNameEmitted || !this.emitter.emit(`${req.eventNameEmitted}`, req, res)) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: `The resource ${req.url} is not found!` }));
        }
      });
    });
  }

}
