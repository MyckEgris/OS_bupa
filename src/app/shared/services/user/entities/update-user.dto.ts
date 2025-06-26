import { Role } from './role';

export interface UpdateUserInputDto {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    isAdministrator: boolean;
    insuranceBusinessId: number;
    position: string;
    providerId?: string;
    agentId?: string;
    policyId?: string;
    authenticationMode: string;
    roles: Array<Role>;
    countryId: string;
    lang: string;
    isApproving?: boolean;
    isApproved?: boolean;
    token: string;
}
