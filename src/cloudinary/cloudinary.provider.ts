import { v2 } from 'cloudinary';

export const CLOUDINARY = 'Cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: 'dopfwxs7h',
      api_key: '929121146831697',
      api_secret: 'rwep7xxl5bTW5W_te20oNtwYl8I',
      secure: true,
    });
  },
};
