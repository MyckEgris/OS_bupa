export interface InteractionDto {
    interationId: string;
    interationByCustomer: boolean;
    createdOn: Date;
    inquiryId: string;
    observation: string;
    owingUser: any;
    documents?: Array<any>;
}
