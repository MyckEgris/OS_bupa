
import { PreAuthDocumentModel } from './preAuthDocumentModel';

/***
 * ReferralPreAuthModel
 */
export interface ReferralPreAuthModel {
    referalLineId: number;
    referralNumber: string;
    eventNo: string;
    document: PreAuthDocumentModel;
}
