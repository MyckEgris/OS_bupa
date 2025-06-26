/**
* PaymentResponseDto.ts
*
* @description: DTO member
* @author Arturo Suarez
* @version 1.0
* @date 10-01-2019.
*
**/

/**
 * DTO member
 */
export class PaymentResponseDto {
    paymentId: number;
    policyId: number;
    amountApplyedUSD: number;
    authorizationCode: string;
    cardNumber: string;
}
