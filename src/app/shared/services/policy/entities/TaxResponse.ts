import { cfdiResponse } from "./cfdiIResponse";

/**
 * Tax response
 */
export interface TaxResponse {
    // usoCFDIId: number;
    // usoCFDISATKey: string;
    // name: string;
    //regimes: regimenResponse[];    
    regimenTypeId: number;
    regimenSATKey: string;
    regimenName: string;
    isIndividual: boolean;
    isCompany: boolean;
    cfdis: cfdiResponse[];
}