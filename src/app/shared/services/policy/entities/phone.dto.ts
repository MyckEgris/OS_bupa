/**
* PhonesDTO.ts
*
* @description: phones of policy's members
* @author Andres Tamayo
* @date 11-02-2019.
*
**/
export interface PhoneOutputDto {
    phoneNumber: string;
    type: string;
    phoneTypeId: number;
    countryId: number;
    areaCodeId: number;
    ext: string;
}
