import { NestFactory, PartialGraphHost } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ResponseInterceptor } from './response/response.interceptor';
import { Server } from 'socket.io';
const http = require('http');
async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./src/cert/key.pem'),
    cert: fs.readFileSync('./src/cert/cert.pem'),
  };
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    abortOnError: false,
  });
  // app.useGlobalInterceptors(new ResponseInterceptor());
  // const server = http.createServer(app);
  // const io = new Server(3002, {
  //   cors: {
  //     origin: '*', // Allow only this origin to connect
  //     // Optional: if your client needs to send cookies or credentials with the requests
  //   },
  // });
  // io.on('connection', (socket) => {
  //   console.log('a user connected');
  // });
  app.enableCors({
    origin: '*', // Allow your front-end domain
    methods: 'GET, POST, PUT, DELETE, OPTIONS', // Allowed methods
    // allowedHeaders: 'Content-Type', // Allowed headers
  });
  await app.listen(3000);
}
bootstrap().catch((err) => {
  fs.writeFileSync('graph.json', PartialGraphHost.toString() ?? '');
  process.exit(1);
});
