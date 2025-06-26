/**
* NetworksByProductKeyDto.ts
*
* @description: DTO networks by productKey
* @author Jose Daniel Hernández M
* @date 20-01-2020.
*
**/

import { NetworkDto } from './network.dto';

export interface NetworksByProductKeyDto {
    productNetworkKey: string;
    networkKey: string;
    network: NetworkDto;
    productkey: string;
    deductibleAmount: number;
    coinsurancePercent: number;
    fromDate: string;
    toDate: string;
}
