/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';

export interface UserPreferenceForm {
  userIdFKFld?: number | any;
  preferenceTypeFld?: number | any;
  preferenceValueFld?: number | any;
  isFavoriteFld?: boolean;
  custom1Fld?: string;
}

export interface LabTestMasterForm {
  labTestFKFld?: number | any;
  isActiveFld?: string;
  createdByFld?: number | any;
  modifiedByFld?: number | any;
  custom1Fld?: string;
}

export interface UserHealthParamForm {
  userIdFKFld?: number | any;
  heightFld?: number | any;
  weightFld?: string;
  bloodgroupFld?: number | any;
  custom1Fld?: string;
}

export const getState = async () => {
  const result = await getHttpClient(ApiEndpoints.state, 'GET');
  return result;
};

export const getZipCode = async () => {
  const result = await getHttpClient(ApiEndpoints.zipcode, 'GET');
  return result;
};

export const getEnterprise = async () => {
  const result = await getHttpClient(ApiEndpoints.enterprise, 'GET');
  return result;
};

export const getCountry = async () => {
  const result = await getHttpClient(ApiEndpoints.country, 'GET');
  return result;
};

export const getStateDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.masterStateDetail}/${id}`, 'GET');
  return result;
};

export const getMasterEnterpriseDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.masterEnterpriseDetail}/${id}`,
    'GET',
  );
  return result;
};

export const getUserHealthParam = async () => {
  const result = await getHttpClient(ApiEndpoints.userHealthParam, 'GET');
  return result;
};

export const getUserHealthParamCreate = async (
  userHealthParamData: UserHealthParamForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createUserHealthParam,
    'POST',
    userHealthParamData,
  );
  return result;
};

export const createLabTestMaster = async (
  labTestMasterFormData: LabTestMasterForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createLabTestMaster,
    'POST',
    labTestMasterFormData,
  );
  return result;
};

export const getLabTestMaster = async () => {
  const result = await getHttpClient(ApiEndpoints.labTestMaster, 'GET');
  return result;
};

export const getLabTestMasterDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.labTestMasterDetail}/${id}`, 'GET');
  return result;
};

export const userPreferenceCreate = async (
  userPreferenceData: UserPreferenceForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createUserPreference,
    'POST',
    userPreferenceData,
  );
  return result;
};

export const getUserPreference = async () => {
  const result = await getHttpClient(ApiEndpoints.userPreference, 'GET');
  return result;
};

export const getUserPreferenceDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.userPreferenceDetail}/${id}`, 'GET');
  return result;
};

export const masterUserPreferenceDelete = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.deleteMmasterUserPreference}`, 'DELETE', null, {
    id: id,
  });
  return result;
}

export const masterLabTestMasterDelete = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.deleteMasterLabTestMaster}`, 'DELETE', null, {
    id: id,
  });
  return result;
}

export const masterUserHealthParamDelete = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.deleteMasterUserHealthParam}`, 'DELETE', null, {
    id: id,
  });
  return result;
}
