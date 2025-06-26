import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { CachingService } from '../caching/caching-service';
import { Observable, throwError } from 'rxjs';
import { MedicalQuestionary } from './entities/medical-questionary.model';
import { InsuranceBusiness } from '../../classes/insuranceBusiness.enum';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicalsService {

  private QUESTIONARIES = 'questionnaires';
  private INSURANCEBUSINESSID = 'insurancebusinessid';
  private PROCESS_OPTION_ID_VALUE = 43;
  private PROCESS_OPTION_ID = 'processOptionId';
  private MEDICAL_QUESTIONARY_NAME = 'medicalquestionaryname';
    /**
   * Constructor
   * @param _http HttpClient Injection
   * @param _config Configuration Service Injection
   * @param _cachingService Caching Service Service Injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService
  ) {
  }

    /**
   * Gets questions
   * @returns questions from medicals
   */
  getQuestions(medicalquestionaryname: string, insuranceBusiness: string): Observable<MedicalQuestionary> {
    const params = new HttpParams()
      .set(this.INSURANCEBUSINESSID,  insuranceBusiness)
      .set(this.PROCESS_OPTION_ID, this.PROCESS_OPTION_ID_VALUE.toString())
      .set(this.MEDICAL_QUESTIONARY_NAME, medicalquestionaryname);
    return this._cachingService.getCached<MedicalQuestionary>(`${this._config.apiHostMedicals}/${this.QUESTIONARIES}`, { params: params })
      .pipe(map(p => (p as any).medicalQuestionary))
      .pipe(catchError(this.handleError)
      );
  }

    /**
   * Gets questions
   * @returns questions from medicals
   */
getQuestionsClaimForm(medicalquestionaryname: string, processoptionvalue: string, insuranceBusiness: string): Observable<MedicalQuestionary[]> {
    const params = new HttpParams()
      .set(this.INSURANCEBUSINESSID,  insuranceBusiness)
      .set(this.PROCESS_OPTION_ID, processoptionvalue)
      .set(this.MEDICAL_QUESTIONARY_NAME, medicalquestionaryname);
    return this._cachingService.getCached<MedicalQuestionary[]>(`${this._config.apiHostMedicals}/${this.QUESTIONARIES}`, { params: params })
      .pipe(map(p => (p as any).medicalQuestionary))
      .pipe(catchError(this.handleError)); 
  }

    /**
   * Handle error
   * @param error HttpErrorResponse
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
