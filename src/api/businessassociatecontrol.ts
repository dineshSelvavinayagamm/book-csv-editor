import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';

export interface BusinessAssociateform {
    businessAssociateNameFld?: string;
    businessAssociateAddressFld?: string;
    businessAssociatePhoneFld?: string;
    businessAssociateMobileFld?: string;
    businessAssociateEmailFld?: string;
    businessAssociateIsActiveFld?: string;
    businessAssociateRemarksFld?: string;
    userIdFkFld?: number | any;
}

export const getcontrolbusinessAssociate = async () => {
    const result = await getHttpClient(ApiEndpoints.controlBusinessAssociate, 'GET');
    return result;
};

export const BusinessAssociateDelete = async (id: string): Promise<void> => {
    const result = await getHttpClient(`${ApiEndpoints.deleteBusinessAssociate}`, 'DELETE', null, {
        id: id,
    });
    return result;
};

export const BussinessAssociateUserCreate = async (userData: BusinessAssociateform): Promise<void> => {
    const result = await getHttpClient(ApiEndpoints.BussinessAssociateUsersCreate, 'POST', userData);
    return result;
};

export const getBussinessAssociateDetail = async (id: string) => {
    const result = await getHttpClient(`${ApiEndpoints.BusinessAssociateDetails}/${id}`, 'GET');
    return result;
};