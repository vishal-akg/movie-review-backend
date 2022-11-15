import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { ConfigService } from '@nestjs/config';
import { v4 } from 'uuid';
import { MovieFileDto } from 'src/movies/dto/movie-file.dto';
import { AvatarFileDto } from 'src/actors/dto/avatar-file.dto';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          transformation: {
            gravity: 'face',
            crop: 'thumb',
            width: 500,
            height: 500,
          },
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(
    public_id: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(public_id, {}, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }

  async uploadVideo(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { resource_type: 'video' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async signAvatar(file: AvatarFileDto) {
    const { name, size, type } = file;
    const public_id = v4();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const eager = 'c_crop,e_redeye,g_face,h_200,r_0,w_200';
    const signature = v2.utils.api_sign_request(
      { timestamp, public_id, eager },
      'rwep7xxl5bTW5W_te20oNtwYl8I',
    );
    return {
      timestamp,
      signature,
      public_id,
      name,
      size,
      type,
      eager,
      api_key: '929121146831697',
    };
  }

  async sign(file: MovieFileDto) {
    const { name, size, type } = file;
    const public_id = v4();
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = v2.utils.api_sign_request(
      { timestamp, public_id },
      'rwep7xxl5bTW5W_te20oNtwYl8I',
    );
    return {
      timestamp,
      signature,
      public_id,
      name,
      size,
      type,
      api_key: '929121146831697',
    };
  }
}
