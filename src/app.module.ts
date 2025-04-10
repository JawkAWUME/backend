import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from './users/auth.module';
import { ContentModule } from './contents/content.module';
import { AIModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGODB_URI ?? ""),
    AuthModule,
    ContentModule,
    AIModule
  ],
  // controllers: [],
  // providers: [],
})
export class AppModule {}
