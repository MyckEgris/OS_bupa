import { Injectable } from '@angular/core';
import { PayeeDto } from './entities/payee.dto';
import { Observable, throwError } from 'rxjs';
import { HttpParams, HttpClient, HttpErrorResponse, HttpRequest, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { catchError } from 'rxjs/operators';
import { UploadResponse } from '../common/entities/uploadReponse';
import { IgnoreInterceptorTypeNames } from '../../classes/ignoreInterceptorType.enum';
@Injectable({
  providedIn: 'root'
})
export class FinanceService {

  private PARAM_POLICYID = 'policyid';

  private PARAM_PREFERRED = 'claimpreferred';

  private PAYEES = 'payees';

  private PARAM_NATUREID = 'policynatureid';

  private PARAM_MEMBERID = 'memberid';

  constructor(
    private http: HttpClient,
    private config: ConfigurationService
  ) { }

  /**
   * Gets products filtering by insurance business id.
   * @param BussinessId Bussiness Id.
   */
  getPayeesByPolicy(policyId: string, policyNatureId?: number, memberId?: number): Observable<any> {
    const params = new HttpParams()
      .set(this.PARAM_POLICYID, policyId)
      .set(this.PARAM_PREFERRED, 'true')
      .set(this.PARAM_NATUREID, policyNatureId ? String(policyNatureId) : "0")
      .set(this.PARAM_MEMBERID, memberId ? String(memberId) : "0");
    return this.http.get(
      `${this.config.apiHostFinance}/${this.PAYEES}`, { params: params })
      .pipe(catchError(this.handleError));
  }

  savePayee(payee: PayeeDto) {

    return this.http.post(`${this.config.apiHostFinance}/${this.PAYEES}`, payee)
      .pipe(catchError(this.handleError));
  }

  savePayeeWithFile(payee: PayeeDto, file: File) {
    const headers = new HttpHeaders()
      .set(IgnoreInterceptorTypeNames.ERROR_400, IgnoreInterceptorTypeNames.ERROR_400);

    const formData = new FormData();
    Object.keys(payee).forEach(key => {
      const value = payee[key];
      formData.append(key, value !== null ? value : '');
    });

    if (file) {
      formData.append('document', file);
    }

    const request = new HttpRequest('POST', `${this.config.apiHostFinance}/${this.PAYEES}/document`, formData, { headers: headers });
    return this.http.request(request).pipe(catchError(this.handleError));

  }

  deactivatePayee(payee: PayeeDto) {
    return this.http.patch(`${this.config.apiHostFinance}/${this.PAYEES}/${payee.payeeId}`, payee)
      .pipe(catchError(this.handleError));
  }

  /**
   * Error handler.
   * @param error HttpErrorResponse.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
