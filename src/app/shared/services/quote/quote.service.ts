import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { ConfigurationService } from '../configuration/configuration.service';
import { QuoteDto } from './entities/quote.dto';
import { Observable, throwError } from 'rxjs';
import { QuoteMode } from './entities/quote-mode.enum';
import { catchError } from 'rxjs/operators';
import { Utilities } from '../../util/utilities';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  private QUOTE: 'quote';

  private DEPENDENT_AGE_LIMIT = 24;

  constructor(
    private http: HttpClient,
    private config: ConfigurationService
  ) { }

  calculateQuote(quote: QuoteDto): Observable<any> {
    const quoteRequest = Object.assign({}, quote);
    quoteRequest.members = this.getUnremovedmembers(quoteRequest);

    if (quote.quoteMode === QuoteMode.Full) {
      quoteRequest.products[0].plans = this.getSelectedPlan(quoteRequest);
    }

    return this.http.post(`${this.config.apiHostQuote}/quote`, { 'quote': quoteRequest }, {});
  }

  private getUnremovedmembers(quoteRequest) {
    const members = [];
    let count = 0;
    if (quoteRequest.members.length > 0) {
      quoteRequest.members.forEach(member => {
        if (!member.removedFromQuote) {
          count++;
          member.memberNumber = count;
          member =  this.verifyAddedSpouseAge(quoteRequest, member);
          members.push(member);
        }
      });
    }
    return members;
  }

  private verifyAddedSpouseAge(quoteRequest, member) {
    if (member.relationTypeId === 3 && member.added) {
      member.age = Utilities.calculateAgeInSpecificDate(member.dateOfBirth, quoteRequest.effectiveDate);
    }

    return member;
  }

  private getSelectedPlan(quoteRequest) {
    const plans = [];
    quoteRequest.products[0].plans.forEach(plan => {
      if (plan.currentPlan) {
        plans.push(plan);
      }
    });

    return plans;
  }

  public exportQuotation(quoteRequest: QuoteDto): Observable<ArrayBuffer> {
    const params = this.AddParamsToQuoteRequest();
    const httpOptions = { 'responseType': 'arraybuffer' as 'json', params };

    return this.http.post<ArrayBuffer>(`${this.config.apiHostQuoteEngine}/quotes`, { 'quote': quoteRequest }, httpOptions)
      .pipe(catchError(this.handleError));
  }

  private AddParamsToQuoteRequest(): HttpParams {
    return new HttpParams()
      .set('export', 'true');
  }

  /**
     * Handle error
     * @param error HttpErrorResponse
     */
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }

}
