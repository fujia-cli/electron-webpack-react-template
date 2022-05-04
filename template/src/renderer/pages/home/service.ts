import { getToken } from '@utils/index';
import { IResponse, request } from '@utils/request';

export const bootstrapUser = async () => {
  let user = null;

  const token = getToken();

  if (token) {
    const res = await request<
      IResponse<{
        username: string;
        avatar?: string;
      }>
    >('profiles');

    if (res.success) {
      user = res.data;
    }
  }

  return user;
};
