import { CustomValidator } from './../../shared/validators/custom.validator';
/**
* ClaimViewContainerComponent.ts
*
* @description: This component handles claims view interactions.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, RequiredValidator } from '@angular/forms';
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { Utilities } from '../../shared/util/utilities';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../shared/services/translation/translation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClaimReportComponent } from '../claim-report/claim-report.component';


/**
 * This component handles claims view interactions.
 */
@Component({
  selector: 'app-claim-view-container',
  templateUrl: './claim-view-container.component.html',
  styleUrls: ['./claim-view-container.component.css']
})
export class ClaimViewContainerComponent implements OnInit, OnDestroy {

  /**
   * Constant for default claim type selected index
   */
  private DEFAULT_CLAIM_TYPE_SELECTED = 0;

  /**
   * Constant for advanced options selector
   */
  private ID_ADVANCED_OPTIONS = '#ig-textomasopciones';

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 3000;

  /**
   * Claim types Array
   */
  public claimTypes: Array<any>;

  /**
   * Constant for state
   */
  public state: string;

  /**
   * Form group for claim view reactive form
   */
  public claimViewForm: FormGroup;

  /**
   * Subject
   */
  public searchNotifier: Subject<any>;

  /**
   * State for searching proccess
   */
  public onSearch: boolean;

  /**
   * Max date
   */
  public maxDate: Date;

  public resetPicker: boolean;

  /**
   * Constructor Method
   * @param translate Translate Service Injection
   * @param translation Translation Service Injection
   */
  constructor(private translate: TranslateService, private translation: TranslationService,private modalService: NgbModal) { }

  /**
   * Create subject object to manage subscription from child components; incomplete, receive and pending and processed.
   * subscribe to language change event to translate the dropdown elements.
   * Create the reactive form to claim view search
   */
  ngOnInit() {
    this.searchNotifier = new Subject<any>();
    this.onSearch = false;
    this.resetPicker = false;
    this.maxDate = Utilities.getDateNow();
    this.claimTypes = this.translateClaimsTypes();
    this.translate.onLangChange.subscribe(() => {
      this.claimTypes = this.translateClaimsTypes();
    });
    Utilities.delay(this.TIME_TO_DELAY);
    this.claimViewForm = this.buildDefaultClaimViewForm();
  }

  ngOnDestroy(): void {
    this.searchNotifier.unsubscribe();
  }

  /**
   * Get claim types options
   */
  getClaimsTypes() {
    return [
      { value: 'incomplete', description: 'CLAIMS.PARENT.CLAIMS_TYPE_OPTIONS.INCOMPLETE' },
      { value: 'pending', description: 'CLAIMS.PARENT.CLAIMS_TYPE_OPTIONS.PENDING' },
      { value: 'processed', description: 'CLAIMS.PARENT.CLAIMS_TYPE_OPTIONS.PROCESSED' }
    ];
  }

  /**
   * Translate claim type according language
   */
  translateClaimsTypes() {
    const claimTypes = this.getClaimsTypes();
    const returnClaimTypes = [];
    for (const type of claimTypes) {
      this.translate.get(type.description).subscribe(t => {
        returnClaimTypes.push({ value: type.value, description: t });
      });
    }
    return returnClaimTypes;
  }

  /**
   * Returns new instance of search form
   */
  private buildDefaultClaimViewForm() {
    return new FormGroup({
      selectedClaimType: new FormControl('', Validators.required),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      dateOfServiceFrom: new FormControl({ datefrom: undefined, dateTo: undefined }),
      dateOfServiceTo: new FormControl({ datefrom: undefined, dateTo: undefined }),
      amountBilled: new FormControl(''),
      bupaClaimNumber: new FormControl(''),
      policyNumber: new FormControl(''),
      accountNumber: new FormControl('')
    });
  }

  /**
   * Show incomplete or processed component, depending of type of claim was selected
   * @param claimForm Search claim Form
   */
  searchClaimView(claimForm) {
    this.state = claimForm.selectedClaimType;
    this.onSearch = true;
    Utilities.delay(100).then(() => {
      this.searchNotifier.next(
        [
          this.claimViewForm.value.selectedClaimType,
          this.claimViewForm.value.firstName,
          this.claimViewForm.value.lastName,
          this.claimViewForm.value.dateOfServiceFrom,
          this.claimViewForm.value.dateOfServiceTo,
          this.claimViewForm.value.amountBilled,
          this.claimViewForm.value.bupaClaimNumber,
          this.claimViewForm.value.policyNumber,
          this.claimViewForm.value.accountNumber
        ]);
    });
  }

  /**
 * Jquery function to toggle more options
 */
  toggleSlideAdvancedOptions() {
    $(this.ID_ADVANCED_OPTIONS).slideToggle();
  }

  clickAddTodo() {
   /* alert('hola!');*/
   const modal = this.modalService.open(ClaimReportComponent);
   modal.result.then(
     this.handleModalClaimReportComponent.bind(this),
      this.handleModalClaimReportComponent.bind(this));
  }
  handleModalClaimReportComponent(){
    alert('se ha cerrado el modal');
  }

  /**
   * Clear fields at change claim type option
   */
  clearFields(resetAllFieds: boolean) {
    this.resetPicker = true;
    if (resetAllFieds) {
      (<FormControl>this.claimViewForm.controls['selectedClaimType']).setValue('');
      (<FormControl>this.claimViewForm.controls['selectedClaimType']).markAsUntouched();
    }
    (<FormControl>this.claimViewForm.controls['firstName']).reset();
    (<FormControl>this.claimViewForm.controls['lastName']).reset();
    (<FormControl>this.claimViewForm.controls['dateOfServiceFrom']).reset();
    (<FormControl>this.claimViewForm.controls['dateOfServiceTo']).reset();
    (<FormControl>this.claimViewForm.controls['amountBilled']).reset();
    (<FormControl>this.claimViewForm.controls['bupaClaimNumber']).reset();
    (<FormControl>this.claimViewForm.controls['policyNumber']).reset();
    (<FormControl>this.claimViewForm.controls['accountNumber']).reset();
    this.onSearch = false;
    this.resetPicker = false;
  }

  compareDatesRange(startDate, endDate) {
    if (startDate && endDate) {
      if (startDate > endDate) {
        return false;
      }
    }
  }

}
