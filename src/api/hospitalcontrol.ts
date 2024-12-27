import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';

export interface Hospitalform {
    hospitalNameFld?: string,
    hospitalAddressFld?: string,
    hospitalPhoneFld?: string,
    hospitalMobileFld?: string,
    hospitalEmailFld?: string,
    hospitalIsActiveFld?: string,
    hospitalRemarksFld?: string
}

export const getcontrolhospital = async () => {
    const result = await getHttpClient(ApiEndpoints.controlhospital, 'GET');
    return result;
};

export const hospitalDelete = async (id: string): Promise<void> => {
    const result = await getHttpClient(`${ApiEndpoints.deletehospital}`, 'DELETE', null, {
        id: id,
    });
    return result;
};

export const HospitalUserCreate = async (userData: Hospitalform): Promise<void> => {
    const result = await getHttpClient(ApiEndpoints.HospitalUsersCreate, 'POST', userData);
    return result;
};

export const getHospitalDetail = async (id: string) => {
    const result = await getHttpClient(`${ApiEndpoints.hospitaldetail}/${id}`, 'GET');
    return result;
};