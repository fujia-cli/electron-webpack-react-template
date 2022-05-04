import { TOKEN_KEY } from '@pages/login-register/service';
import { notification } from 'antd';
import { NotificationPlacement, IconType } from 'antd/lib/notification';
import { isNumber } from '@fujia/hammer';

export const isHttpOrHttpsUrl = (url: string) => {
  const regRule = /(http|https):\/\/([\w.]+\/?)\S*/;

  return regRule.test(url.toLowerCase());
};

export const isInteger = (val: unknown): val is number => isNumber(val) && parseInt(val.toFixed(1), 10) === val;

export const getToken = (key = TOKEN_KEY) => window.electron.store.get(key);

export const myNotification = (options: {
  message: string;
  type?: IconType;
  description?: string;
  placement?: NotificationPlacement;
}) => {
  const { message, type = 'info', description = '', placement = 'bottomRight' } = options;

  notification[type]({
    message,
    description,
    placement,
  });
};
