import { Injectable } from '@angular/core';
import { ReportConfig } from './entities/ReportConfig';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ReportConfiguration } from './entities/ReportConfiguration';
import { ConfigurationService } from '../configuration/configuration.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  /**
   * indicates common api
   */
  private COMMON = 'common';

   /**
   * indicates common api
   */
  private REPORTS = 'reports';


  /**
   * [HttpGet] Constant for Configurations endpoint
   */
  private CONFIGURATIONS = 'configurations';
  public reportConfig: ReportConfig;
  constructor(private http: HttpClient,
    private config: ConfigurationService) { }

  getReportConfigurations(reportName: string): Observable<ReportConfiguration[]> {
    return this.http.get(`${this.config.apiHostCommon}/${this.COMMON}/${this.REPORTS}/${reportName}/${this.CONFIGURATIONS}`)
      .pipe(map(p => (p as any).reportConfigurations))
      .pipe(catchError(this.handleError));
  }


  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
