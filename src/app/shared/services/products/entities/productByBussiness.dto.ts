/**
* ProductByBussinessDto.ts
*
* @description: DTO product by bussiness
* @author Jose Daniel Hernández M
* @date 20-01-2020.
*
**/

export interface ProductByBussinessDto {
    productKey: string;
    insuranceBusinessId: number;
    name: string;
    description: string;
    outOfNetworkCoinsurance: number;
    isClosedProduct: boolean;
    productExternalId: string;
}
