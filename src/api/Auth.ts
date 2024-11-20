import { ApiEndpoints } from '@/constants';
import { getHttpClient } from '@/services/AxiosClient';
import { StorageService } from '@/services/StorageService';

export const login = async (mobileNumber: string, password: string) => {
  const result = await getHttpClient(ApiEndpoints.login, 'POST', {
    mobileNumber,
    password,
  });
  if (result) {
    StorageService.authToken.setValue(result.data.token);
    return result;
  }
};
