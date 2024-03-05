import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CoffeesModule,
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin123@ecommerce.uimwiya.mongodb.net/nest-course',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
