import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GatewayController } from './controllers/gateway.controller';
import { ProxyService } from './services/proxy.service';

@Module({
  imports: [HttpModule],
  controllers: [GatewayController],
  providers: [ProxyService],
})
export class AppModule {}
