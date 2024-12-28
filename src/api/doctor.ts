import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';


export interface CreateDoctor {
    doctorFirstNameFld? : string;
    doctorLastNameFld? : string;
    passwordFld? : string;
    doctorEmailFld? : string;
    doctorMobileFld? : string;
    doctorPhoneFld? : string;
    doctorSpecialityFld? : string;
    doctorQualificationFld? : string;
    doctorExperienceFld? : string;
    doctorRemarksFld?: string;
}

export const getDoctorsList = async () => {
    const result = await getHttpClient(ApiEndpoints.doctorsList, 'GET');
    return result;
  };

export const getDoctorDetail = async (id: string) => {
    const result = await getHttpClient(`${ApiEndpoints.doctorDetail}/${id}`, 'GET');
    return result;
  };

export const doctorDelete = async (id: string): Promise<void> => {
    const result = await getHttpClient(`${ApiEndpoints.deleteDoctor}`, 'DELETE', null, {
      id: id,
    });
    return result;
  };

export const doctorCreate = async (doctorData: CreateDoctor): Promise<void> => {
    const result = await getHttpClient(ApiEndpoints.createDoctor, 'POST', doctorData);
    return result;
  };

