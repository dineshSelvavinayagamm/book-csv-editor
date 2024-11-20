/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';

export interface TestPriceForm {
  priceFld?: any;
  testNameFld?: string;
  discountFld?: any;
  isActiveFld?: string;
  custom1Fld?: string;
}

export interface TestPackagePriceForm {
  testPackageNameFld?: string;
  testPackageFKFld?: any;
  priceFld?: any;
  discountFld?: any;
  isActiveFld?: string;
  custom1Fld?: string;
}

export interface TestPackageListForm {
  testPackageFKFld?: any;
  labTestFKFld?: any;
  isActiveFld?: string;
  custom1Fld?: string;
}

export interface TestPackageForm {
  testPackageNameFld?: string;
  testPackageIDFld?: string;
  parameterAliaseFld?: string;
  descriptionFld?: string;
  isActiveFld?: string;
  custom1Fld?: string;
}

export interface TestMasterForm {
  testParameterNameFld?: string;
  testNameFld?: string;
  testIDFld?: string;
  testAliaseFld?: string;
  descriptionFld?: string;
  testCategoryFld?: number | any;
  isActiveFld?: string;
}

export interface BloodGroupForm {
  shortNameFld?: string;
  aliasFld?: string;
  longName_Fld?: string;
}

export interface TestParameterMasterForm {
  testParameterNameFld?: string;
  testParameterIDFld?: string;
  parameterAliaseFld?: string;
  descriptionFld?: string;
  isActiveFld?: string;
  custom1Fld?: string;
}

export const testPriceCreate = async (testPriceData: TestPriceForm): Promise<void> => {
  const result = await getHttpClient(ApiEndpoints.createTestPrice, 'POST', testPriceData);
  return result;
};
export const getTestPrice = async () => {
  const result = await getHttpClient(ApiEndpoints.testPrice, 'GET');
  return result;
};

export const getTestPriceDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.testPriceDetail}/${id}`, 'GET');
  return result;
};

export const testParameterMasterCreate = async (
  testParameterMasterData: TestParameterMasterForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createTestParameterMaster,
    'POST',
    testParameterMasterData,
  );
  return result;
};

export const getTestParameterMaster = async () => {
  const result = await getHttpClient(ApiEndpoints.testParameterMaster, 'GET');
  return result;
};

export const getTestParameterMasterDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.testParameterMasterDetail}/${id}`,
    'GET',
  );
  return result;
};

export const testPackageCreate = async (
  testPackageData: TestPackageForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createTestPackage,
    'POST',
    testPackageData,
  );
  return result;
};

export const getTestPackage = async () => {
  const result = await getHttpClient(ApiEndpoints.testPackage, 'GET');
  return result;
};

export const getTestPackageDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.testPackageDetail}/${id}`, 'GET');
  return result;
};

export const testPackagePriceCreate = async (
  testPackagePriceData: TestPackagePriceForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createTestPackagePrice,
    'POST',
    testPackagePriceData,
  );
  return result;
};

export const getTestPackagePrice = async () => {
  const result = await getHttpClient(ApiEndpoints.testPackagePrice, 'GET');
  return result;
};

export const getTestPackagePriceDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.testPackagePriceDetail}/${id}`,
    'GET',
  );
  return result;
};

export const testPackageListCreate = async (
  testPackageListData: TestPackageListForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createTestPackageList,
    'POST',
    testPackageListData,
  );
  return result;
};

export const getTestPackageList = async () => {
  const result = await getHttpClient(ApiEndpoints.testPackageList, 'GET');
  return result;
};

export const getTestPackageListDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.testPackageListDetail}/${id}`,
    'GET',
  );
  return result;
};

export const testMasterCreate = async (testMasterData: TestMasterForm): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createTestMaster,
    'POST',
    testMasterData,
  );
  return result;
};
export const getTestMaster = async () => {
  const result = await getHttpClient(ApiEndpoints.testMaster, 'GET');
  return result;
};
export const getBusinessEntityType = async () => {
  const result = await getHttpClient(ApiEndpoints.businessEntity, 'GET');
  return result;
};

export const getTestMasterDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.testMasterDetail}/${id}`, 'GET');
  return result;
};

export const bloodGroupCreate = async (bloodGroupData: BloodGroupForm): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.createBloodGroup,
    'POST',
    bloodGroupData,
  );
  return result;
};
export const getBloodGroup = async () => {
  const result = await getHttpClient(ApiEndpoints.bloodGroup, 'GET');
  return result;
};

export const getBloodGroupDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.bloodGroupDetail}/${id}`, 'GET');
  return result;
};

export const labTestPriceDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestPrice}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const labTestParameterMasterDelate = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestParameterMaster}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const labTestPackagePriceDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestPackagePrice}`, 'DELETE', null, {
    id: id,
  });

  return result;
};

export const labTestPackageListDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestPackageList}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const labTestPackageDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestPackage}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const labTestMasterDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestMaster}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const labTestBloodGroupDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteLabTestBloodGroup}`, 'DELETE', null, {
    id: id,
  });
  return result;
};
