import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { CachingService } from '../caching/caching-service';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ListSubjectDto } from './entities/list-subject.dto';
import { InquiryDto } from './entities/inquiry.dto';
import { ConstansParamInquiry } from './constants/constants-params-inquiry';
import { InquiryResponseDto } from './entities/inquiry-response.dto';
import { Utilities } from '../../util/utilities';
import { InquiriesOutputDto } from './entities/inquiries-output.dto';
import { AttachmentResponseDto } from './entities/attachment-response.dto';
import { InteractionResponseDto } from './entities/interaction-response.dto';
import { InteractionRequestDto } from './entities/interaction-request.dto';
import { InteractionDocument } from './entities/interaction-document';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  /**
   * [HttpGet] Constant for subjects endpoint
   */
  private SUBJECTS = 'subjects';

  /**
   * [post] Constant for inquiry endpoint
   */
  private INQUIRYS = 'inquiries';

  /**
   * [post] Constant for inquiry endpoint
   */
  private CUSTOMERS = 'customers';

  private inquiryForResult: InquiriesOutputDto;

  private inquiryResponse: InquiriesOutputDto[];

  private interactionsUrl = '/assets/mocks/inquiry/interactions.json';

  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private _cachingService: CachingService) {
   }


   /***
    * Get List of Subject for Role (The backend take the role of token)
    */
  getSubjects(): Observable<ListSubjectDto> {
    return this._cachingService.getCached<ListSubjectDto>(`${this._config.apiHostCustomer}/${this.SUBJECTS}`)
      .pipe(catchError(this.handleError));
  }

  /***
   * Create information request in CRM
   */
  saveInquiry(inquiryDto: InquiryDto, userKey: string) {
    return this._http.post(`${this._config.apiHostCustomer}/${this.CUSTOMERS}/${userKey}/${this.INQUIRYS}`, inquiryDto);
  }

  /***
   * Search Information Request
   */
  getInquiryByParams(userKey: string, ticketNumber: string,
              subjectId: string, createdFrom: string, createdTo: string,
              pageIndex: number, pageSize: number): Observable<InquiryResponseDto> {

    let params = new HttpParams()
        .set(ConstansParamInquiry.PARAM_PAGE_INDEX, pageIndex.toString())
        .set(ConstansParamInquiry.PARAM_PAGE_SIZE, pageSize.toString());

    params = this.addParamsOptional(params, ticketNumber, subjectId, createdFrom, createdTo);
    return this._http.get<InquiryResponseDto>
        (`${this._config.apiHostCustomer}/${this.CUSTOMERS}/${userKey}/${this.INQUIRYS}`, { params: params })
          .pipe(catchError(this.handleError));
  }

  /**
   * Get documents by inquiry id and suject WEB
   * @param inquiryId Inquiry ID
   */
  getAttachmentsByInquiryId(inquiryId): Observable<AttachmentResponseDto> {
    return this._http.get<AttachmentResponseDto>
        (`${this._config.apiHostCustomer}/${this.INQUIRYS}/${inquiryId}/attachments`)
          .pipe(catchError(this.handleError));
  }

  /**
   * Get bytes content by attachment and inquiry
   * @param inquiryId Inquiry ID
   * @param attachmentId attachment ID
   */
  getAttachmentContentByInquiryId(inquiryId, attachmentId): Observable<any> {
    const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    return this._http.get
        (`${this._config.apiHostCustomer}/${this.INQUIRYS}/${inquiryId}/attachments/${attachmentId}/content`, httpOptions)
          .pipe(catchError(this.handleError));
  }

  /**
   * Get documents by inquiry id and suject WEB
   * @param inquiryId Inquiry ID
   */
  getInteractionsByInquiryId(inquiryId: string, pageIndex: number, pageSize: number): Observable<InteractionResponseDto> {
    const params = new HttpParams()
        .set(ConstansParamInquiry.PARAM_PAGE_INDEX, pageIndex.toString())
        .set(ConstansParamInquiry.PARAM_PAGE_SIZE, pageSize.toString());

    return this._http.get<InteractionResponseDto>
        (`${this._config.apiHostCustomer}/${this.INQUIRYS}/${inquiryId}/interactions`, { params: params })
          .pipe(catchError(this.handleError));

    /*return this._http.get<InteractionResponseDto>(this.interactionsUrl)
            .pipe(catchError(this.handleError));*/
  }

  /**
   * Get documents by inquiry id and suject WEB
   * @param inquiryId Inquiry ID
   */
  getAttachmentsByInteractionId(inquiryId, interactionId): Observable<AttachmentResponseDto> {
    return this._http.get<AttachmentResponseDto>
        (`${this._config.apiHostCustomer}/${this.INQUIRYS}/${inquiryId}/interactions/${interactionId}/attachments`)
          .pipe(catchError(this.handleError));
  }

  /**
   * Get bytes content by attachment and inquiry
   * @param inquiryId Inquiry ID
   * @param attachmentId attachment ID
   */
  getInteractionAttachmentContentByInquiryId(inquiryId, interactionId, attachmentId): Observable<any> {
    const httpOptions = { 'responseType': 'arraybuffer' as 'json' };
    return this._http.get
        // tslint:disable-next-line: max-line-length
        (`${this._config.apiHostCustomer}/${this.INQUIRYS}/${inquiryId}/interactions/${interactionId}/attachments/${attachmentId}/content`, httpOptions)
          .pipe(catchError(this.handleError));
  }

  buildInteraction(inquiryId: string, observation: string, documents: Array<InteractionDocument>) {
    const interaction: InteractionRequestDto = {
      interationByCustomer: true,
      inquiryId: inquiryId,
      observation: observation,
      statusCode: 594210001,
      attachments: documents
    };

    return interaction;
  }

  /***
   * Create information request in CRM
   */
  saveInteraction(interaction: InteractionRequestDto) {
    return this._http.post(`${this._config.apiHostCustomer}/${this.INQUIRYS}/${interaction.inquiryId}/interactions`, interaction);
  }

  /***
   * Set parameters optionals for query of Information Request
   */
  private addParamsOptional(paramsP: HttpParams, ticketNumber: string,
      subjectId: string, createdFrom: string, createdTo: string): HttpParams {
    let params = new HttpParams();
    if (paramsP) {
      params = paramsP;
    }
    if (ticketNumber) {
      params = params.set(ConstansParamInquiry.TICKET_NUMBER, ticketNumber);
    } if (subjectId) {
      params = params.set(ConstansParamInquiry.SUBJECT_ID, subjectId);
    } if (createdFrom && createdTo) {
      params = params.set(ConstansParamInquiry.CREATE_FROM, Utilities.convertDateToString(createdFrom));
      params = params.set(ConstansParamInquiry.CREATE_TO, Utilities.convertDateToString(createdTo));
    }
    return params;
  }

  /**
   * Error handler.
   * @param error HttpErrorResponse.
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

  /**
   * Set inquiries data
   * @param inquiries Inquiries
   */
  setInquiryResponse(inquiries: InquiriesOutputDto[]) {
    this.inquiryResponse = inquiries;
  }

  /**
   * Get inquiries data
   */
  getInquiryResponse(): InquiriesOutputDto[] {
    return this.inquiryResponse;
  }

  /**
   * Find inquiry in inquiries data array
   * @param inquiryId Inquiry ID
   */
  getInquiryFromInquiryResponse(inquiryId): InquiriesOutputDto {
    return this.inquiryResponse ? this.inquiryResponse.find(x => x.inquiryId === inquiryId) : null;
  }

  /**
   * Set inquiry
   * @param inquiry Inquiry ID
   */
  setInquiryResultByInquiry(inquiry: InquiriesOutputDto) {
    this.inquiryForResult = inquiry;
  }

  /**
   * Get inquiry
   */
  getInquiryResultByInquiry(): InquiriesOutputDto {
    return this.inquiryForResult;
  }

}
