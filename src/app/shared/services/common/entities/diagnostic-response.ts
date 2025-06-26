import { DiagnosticDto } from './diagnostic.dto';

/***
 * Interface for the get data of the Diagnostics
 */
export interface DiagnosticResponse {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: DiagnosticDto[];
}
