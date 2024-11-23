import { ApiEndpoints } from '@/constants/Endpoints';
import { getHttpClient } from '@/services/AxiosClient';

export interface ProfileForm {
  userTypeFld?: string;
  userNameFld?: string;
  titleFld?: string;
  firstNameFld?: string;
  middleNameFld?: string;
  lastNameFld?: string;
  employeeIdFKFld?: string;
  emailFld?: string;
  mobileFld?: string;
  phoneFld?: string;
  isActiveFld?: string;
  remarksFld?: string;
}

export interface GroupForm {
  nameFld?: string;
  descriptionFld?: string;
  isSystemDefinedFld?: string;
}

export interface SecurityRolePrivilegeForm {
  securityRoleIdFKFld?: string;
  securityPrivilegeIdFKFld?: string;
}
export interface SecurityGroupRoleForm {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  securityRole?: number | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  securityGroup?: number | any;
}

export interface PrivilegeForm {
  nameFld: string;
  descriptionFld: string;
  isSystemDefinedFld: string;
}

export interface RoleForm {
  nameFld?: string;
  descriptionFld: string;
  isSystemDefinedFld: string;
}

export interface SecurityGroupUserForm {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  securityGroup?: number | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: number | any;
}

export const getAccessGroup = async () => {
  const result = await getHttpClient(ApiEndpoints.accessGroups, 'GET');
  return result;
};

export const getAccessSecurityGroupRole = async () => {
  const result = await getHttpClient(ApiEndpoints.accessSecuritygrouprole, 'GET');
  return result;
};

export const getAccessRole = async () => {
  const result = await getHttpClient(ApiEndpoints.accessRoles, 'GET');
  return result;
};

export const getAccessSecurityRolePrivilege = async () => {
  const result = await getHttpClient(ApiEndpoints.accessSecurityRolePrivilege, 'GET');
  return result;
};

export const getAccessPrivilege = async () => {
  const result = await getHttpClient(ApiEndpoints.accessPrivilege, 'GET');
  return result;
};

export const getUserList = async () => {
  const result = await getHttpClient(ApiEndpoints.user, 'GET');
  return result;
};

export const getAccessSecurityGroupUser = async () => {
  const result = await getHttpClient(ApiEndpoints.accessSecurityGroupUser, 'GET');
  return result;
};

export const userCreate = async (userData: ProfileForm): Promise<void> => {
  const result = await getHttpClient(ApiEndpoints.userCreate, 'POST', userData);
  return result;
};

export const GroupUserCreate = async (userData: GroupForm): Promise<void> => {
  const result = await getHttpClient(ApiEndpoints.GroupUserCreate, 'POST', userData);
  return result;
};

export const SecurityRolePrivilegeUserCreate = async (
  userData: SecurityRolePrivilegeForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.SecurityRolePrivilegeUserCreate,
    'POST',
    userData,
  );
  return result;
};

export const SecurityGrouproleCreate = async (
  userData: SecurityGroupRoleForm,
): Promise<void> => {
  const result = await getHttpClient(
    ApiEndpoints.CreateSecurityGrouprole,
    'POST',
    userData,
  );
  return result;
};

export const PrivilegeUserCreate = async (userData: PrivilegeForm): Promise<void> => {
  const result = await getHttpClient(ApiEndpoints.PrivilegeUserCreate, 'POST', userData);
  return result;
};

export const roleCreate = async (userData: RoleForm) => {
  const result = await getHttpClient(ApiEndpoints.roleCreate, 'POST', userData);
  return result;
};

export const accessSecurityGroupUserCreate = async (userData: SecurityGroupUserForm) => {
  const result = await getHttpClient(
    ApiEndpoints.createAccessSecurityGroupUser,
    'POST',
    userData,
  );
  return result;
};

export const userDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.userDelete}`, 'DELETE', null, {
    id: id,
  });
  return result;
};
export const roleDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteRole}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const privilegeDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deletePrivilege}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const groupDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(`${ApiEndpoints.deleteGroup}`, 'DELETE', null, {
    id: id,
  });
  return result;
};

export const securityRolePrivilegeDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(
    `${ApiEndpoints.deletesecurityRolePrivilege}`,
    'DELETE',null, {
      id: id,
    }
  );
  return result;
};
export const securitygrouproleDelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(
    `${ApiEndpoints.deleteSecurityGroupRole}`,
    'DELETE', null, {
      id: id,
    }
  );
  return result;
};

export const securitygroupuserdelete = async (id: string): Promise<void> => {
  const result = await getHttpClient(
    `${ApiEndpoints.deletesecuritygroupuser}`,
    'DELETE', null, {
      id: id,
    }
  );
  return result;
};

export const getUserDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.userDetail}/${id}`, 'GET');
  return result;
};

export const getRolesDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.rolesDetail}/${id}`, 'GET');
  return result;
};

export const getPrivilegeDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.privilegeDetail}/${id}`, 'GET');
  return result;
};

export const getGroupDetail = async (id: string) => {
  const result = await getHttpClient(`${ApiEndpoints.groupDetail}/${id}`, 'GET');
  return result;
};

export const securityGroupRoleDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.detailAccessSecurityGroupRole}/${id}`,
    'GET',
  );
  return result;
};

export const securityRolePrivilegeDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.detailAccessSecurityRolePrivilege}/${id}`,
    'GET',
  );
  return result;
};

export const securityGroupUserDetail = async (id: string) => {
  const result = await getHttpClient(
    `${ApiEndpoints.detailAccessSecurityGroupUser}/${id}`,
    'GET',
  );
  return result;
};
