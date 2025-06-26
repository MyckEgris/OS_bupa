/**
* AddedNetworkDto.ts
*
* @description: DTO added network
* @author Jose Daniel Hernández M
* @date 11-02-2020.
*
**/

export interface AddedNetworkDto {
    productKey: string;
    networkKey: string;
    deductibleAmount: number;
    coinsurancePercent: number;
    fromDate: string;
    toDate: string;
}
