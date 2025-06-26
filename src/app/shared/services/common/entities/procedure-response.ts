import { ProcedureDto } from './procedure.dto';

/***
 * Interface for the get data of the Procedures
 */
export interface ProcedureResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: ProcedureDto[];
}
