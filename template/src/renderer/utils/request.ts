import { Request } from '@fujia/fetch';
import { isDev } from '@fujia/hammer';

import { TOKEN_KEY } from '@pages/login-register/service';

const BASE_URL = isDev ? 'http://localhost:3001' : 'http://yapi.smart-xwork.cn/mock/148318';

import { getToken } from '@utils/index';

export interface IResponse<D = any> {
  success: boolean;
  data?: D;
  msg?: string;
}

export const request = Request.create({
  baseUrl: BASE_URL,
  requestInterceptor: (config) => {
    const token = getToken(TOKEN_KEY);

    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
});
