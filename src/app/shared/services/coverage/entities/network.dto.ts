/**
* NetworkDto.ts
*
* @description: DTO network
* @author Jose Daniel Hernández M
* @date 20-01-2020.
*
**/

export interface NetworkDto {
    networkKey: string;
    networkId: string;
    networkName: string;
    networkDescription: string;
    fromDate: string;
    toDate: string;
    parentNetworkKey: string;
}
