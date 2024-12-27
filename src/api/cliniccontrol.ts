import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';

export interface ClinicForm {
    clinicNameFld?: string,
    clinicAddressFld?: string,
    clinicPhoneFld?: string,
    clinicMobileFld?: string,
    clinicEmailFld?: string,
    clinicIsActiveFld?: string,
    clinicRemarksFld?: string
}

export const getcontrolclinic = async () => {
    const result = await getHttpClient(ApiEndpoints.controlclinic, 'GET');
    return result;
};

export const clinicDelete = async (id: string): Promise<void> => {
    const result = await getHttpClient(`${ApiEndpoints.deleteclinic}`, 'DELETE', null, {
        id: id,
    });
    return result;
};

export const ClinicUserCreate = async (userData: ClinicForm): Promise<void> => {
    const result = await getHttpClient(ApiEndpoints.ClinicUserCreate, 'POST', userData);
    return result;
};

export const getClinicDetail = async (id: string) => {
    const result = await getHttpClient(`${ApiEndpoints.clinicdetails}/${id}`, 'GET');
    return result;
};