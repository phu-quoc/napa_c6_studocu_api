import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from '@/modules/users/users.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { appConfig, getENVFile, typeormConfig } from '@/configs';
import { MailModule } from '@/modules/mail/mail.module';
import { UniversitiesModule } from './modules/universities/universities.module';
import { CoursesModule } from './modules/courses/courses.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getENVFile(),
      load: [appConfig, typeormConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>('typeorm', {}),
    }),
    UsersModule,
    AuthModule,
    MailModule,
    UniversitiesModule,
    CoursesModule,
    DocumentsModule,
    CategoriesModule,
    CommentsModule,
    CloudinaryModule,
    UploadModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
