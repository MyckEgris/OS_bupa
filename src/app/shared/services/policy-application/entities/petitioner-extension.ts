export interface PetitionerExtension {
    averageAnnualIncome: string;
    placeWherePayTaxes: string;
    isUsResident: boolean;
    isPEP: boolean;
    relationshipPEP: boolean;
    associatedPEP: boolean;
    workPlace?: string;
    performingJob?: string;
    maritalStatusId?: number;
    countryResidencyId?: number;
}
