import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CoverageByPlanKeyDto } from 'src/app/shared/services/coverage/entities/coverageByPlanKey.dto';

import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { CoverageDto } from 'src/app/shared/services/coverage/entities/coverage.dto';
import { CoveragesService } from 'src/app/shared/services/coverage/coverages.service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { element } from 'protractor';
import * as _ from 'underscore';

@Component({ selector: 'app-add-plans-modal', templateUrl: './add-plans-modal.component.html' })
export class AddPlansModalComponent implements OnInit, OnDestroy {
  /**
   * Input PlanKey: string;
   */
  @Input() inputPlanKey: string;

  /**
 * Input AddedCoverages
 */
  @Input() inputAddedCoverages: CoverageByPlanKeyDto[];

  /**
 * Output seleted coverages
 */
  @Output() selectedCoverages = new EventEmitter<any>();

  /**
 * productkey
 */
  private plankey: string;

  /**
 * AddedNetworks
 */
  private AddedCoverages: CoverageByPlanKeyDto[];

  /**
 * Object for networks response NetworkResponse
 */
  public coveragesResponse: any;

  /**
 * Collection size for pagination component
 */
  public collectionSize: number;

  /**
 * Init page for pagination component
 */
  private INIT_PAGE = 1;

  /**
 * Page size for pagination component
 */
  public PAGE_SIZE = 25;

  /**
 * Current page for pagination component
 */
  public page: number;

  /**
 * Flag for searching proccess
 */
  public searchProccess = false;

  /**
 * List selected networks
 */
  public listSelectedCoverages: CoverageDto[];

  /**
 * List selected converted networks
 */
  public listSelectedConvertedCoverages: CoverageByPlanKeyDto[];

  /**
 * Subscription Networks
 */
  private subCoverages: Subscription;

  /**
 * flag for input info
 */
  public inputInfo = true;

  /**
   * Holds the form information
   */
  public formAddPlansModal: FormGroup;

  /**
   * Constant to obtain coverage form array
   */
  public COVERAGES_FORM_ARRAY = 'coverages';

  /**
   * Constant to obtain selectAll form control
   */
  public SELECT_ALL_CTRL = 'selectAll';

  /**
 * Constants for the add networks modal message.
 */
  private ADD_NETWORK_MSG_TITLE = 'NETWORK.ADD_NETWORKS.TITLE_MSG';
  private ADD_NETWORK_MSG_OK_BTN = 'APP.BUTTON.CONTINUE_BTN';
  private DELETE_CURRENT_SELECTION = 'COVERAGES.ADD_PLANS.DELETE_CURRENT_SELECTION';

  private EXIST_CHECKED_NETWOKR_MSG = 'NETWORK.ADD_NETWORKS.ADD_EXIST_NETWORK_MSG';

  constructor(public activeModal: NgbActiveModal, private coveragesService: CoveragesService, private translate: TranslateService, private notification: NotificationService) { }

  /**
 * Executed when the component is destroyed
 */
  ngOnDestroy(): void {
    if (this.subCoverages) {
      this.subCoverages.unsubscribe();
    }
  }

  /**
 * Executed when the component is initiallized
 */
  ngOnInit() {
    this.formAddPlansModal = this.buildFormAddPlansModalPlans();
    this.initiallizeVariables();
    this.getInputInformation();
  }

  /**
   * Builds form add plans modal plans
   * @returns form add plans modal plans 
   */
  buildFormAddPlansModalPlans(): FormGroup {
    return new FormGroup({
      coverages: new FormArray([]),
      selectAll: new FormControl('', [])
    });
  }

  /**
 * Initiallize component variables
 */
  initiallizeVariables() {
    this.coveragesResponse = {
      count: 0,
      pageIndex: 1,
      pageSize: 0,
      data: []
    };
    this.listSelectedCoverages = [];
    this.listSelectedConvertedCoverages = [];
    this.collectionSize = 0;
    this.page = this.INIT_PAGE;
  }

  /**
 * Validates and gets the input info
 */
  getInputInformation() {
    if (this.inputPlanKey) {
      this.plankey = this.inputPlanKey;
      this.AddedCoverages = this.inputAddedCoverages;
      this.inputInfo = true;
      this.page = this.INIT_PAGE;
      this.searchCoveragesByPlanKey(this.page);
    } else {
      this.inputInfo = false;
    }
  }

  /**
 * Search not associated networks filtering by plan key.
 */
  searchCoveragesByPlanKey(page: number) {
    if (this.inputInfo) {
      this.searchProccess = false;
      this.subCoverages = this.coveragesService.getNotAssociatedCoveragesByPlanKey(this.plankey, String(true), String(page), String(this.PAGE_SIZE)).subscribe(data => {
        this.coveragesResponse = this.validationSelectElemetList(data);

        this.formAddPlansModal.get(this.SELECT_ALL_CTRL).setValue(false);
        this.handleCoverages(this.coveragesResponse.data);
        this.searchProccess = true;
        this.collectionSize = data.count;
        
      }, error => {
        this.coveragesResponse = {
          count: 0,
          pageIndex: 1,
          pageSize: 0,
          data: []
        };
        this.collectionSize = 0;
        this.handleError(error);
      });
    }
  }
 /**
 * validates existing element selected in the view by identification
 * @param dataCoveragesSearch
 */
 validationSelectElemetList(data: any){
  this.inputAddedCoverages.forEach(element =>{
    data.data.forEach(item => {
      if(item.coverageKey === element.coverageKey){
        item.isSelect = true;
      }
    });
  }); 
  return data;
 }

  /**
   * Handles coverages when change page
   * @param data 
   */
  handleCoverages(data: any[]) {
    this.formAddPlansModal.removeControl(this.COVERAGES_FORM_ARRAY);
    this.formAddPlansModal.addControl(this.COVERAGES_FORM_ARRAY, new FormArray([]));
    this.formAddPlansModal.updateValueAndValidity();
    data.forEach(element => {
      const coveragesList = this.formAddPlansModal.get(this.COVERAGES_FORM_ARRAY) as FormArray;
      var plan = this.listSelectedCoverages.filter(data => (data.coverageKey === element.coverageKey));
      if (plan !== null && plan.length > 0) {
        coveragesList.push(new FormControl(true, []));
      } else {
        coveragesList.push(new FormControl('', []));
      }
    });
  }

  /***
 * Handle error
 */
  private handleError(error: any) {
    if (error.status === 404) {
      this.searchProccess = true;
      this.coveragesResponse = {
        count: 0,
        pageIndex: 1,
        pageSize: 0,
        data: []
      };
    } else {
      this.searchProccess = false;
    }
  }

  /**
 * Updates pagination
 */
  changePageOfExcludedCoverages(page: number) {
    if (!page) {
      return;
    }
    this.page = page;
    this.searchCoveragesByPlanKey(this.page);
  }

  /***
 * Emit event when accept the list coverages selected
 */
  acceptCoveragesSelected() {
    this.convertedSelectedExcludedCoverages(this.listSelectedCoverages);
    const data = {
      action : 'addElement',
      item : this.listSelectedConvertedCoverages
    }
    this.selectedCoverages.emit(data);
    this.activeModal.close();
  }

  /**
 * Store selected converted excluded networks
 */
  convertedSelectedExcludedCoverages(selectedCoverages: CoverageDto[]) {
    if (selectedCoverages) {
      selectedCoverages.forEach(element => {
        const convertedCoverage: CoverageByPlanKeyDto = {
          coverageKey: element.coverageKey,
          waitingPeriodBetweenSameServiceDays: 0,
          waitingPeriodDays: null,
          requiresPreauthorization: false,
          coverages: {
            coverageKey: element.coverageKey,
            coverageName: element.coverageName,
            coverageSourceCode: element.coverageSourceCode,
            gender: element.gender,
            maxAge: element.maxAge,
            minAge: element.minAge,
            fromDate: element.fromDate,
            toDate: element.toDate,
            coverageId: element.coverageId
          },
          planKey: this.plankey,
          fromDate: '',
          toDate: '',
          waitingPeriodMonths: null,
          coinsurance: null,
          deductible: true,
          copay: null,
          costLimitTotal: null,
          costLimitUnit: null,
          quantityLimit: null,
          generalWaitingPeriodDays: null
        };
        this.listSelectedConvertedCoverages.push(convertedCoverage);
      });
    }
  }

  /**
 * Store selected excluded networks
 */
  seletedCoverage(coverage: any, event) {
    if (event.target.checked) {
      const indexAddedNet = this.AddedCoverages.findIndex(e => e.coverageKey === coverage.coverageKey);
      if (indexAddedNet === -1) {
        this.listSelectedCoverages.push(coverage);
      } else {
        event.target.checked = false;
        this.showMessage(this.EXIST_CHECKED_NETWOKR_MSG);
      }

    } else {
      const indexNetw = this.listSelectedCoverages.findIndex(e => e.coverageKey === coverage.coverageKey);
      this.listSelectedCoverages.splice(indexNetw, 1);
      this.removeElementListCoverages(coverage);
    }
  }

/**
 * Seleted all check page or un select all on change selectAll formcontrol 
 * @param event 
 */
  removeElementListCoverages(item){
    var data = {
      action : 'removeElement',
      item : item
    };
    this.selectedCoverages.emit(data);
  }


  /***
 * Show message.
 * @param msgPath Message Path.
 * @param titlePath Title Path.
 * @param okBtnPath Ok Button Path.
 */
  showMessage(msgPath: string, titlePath?: string, okBtnPath?: string) {
    let message = '';
    let messageTitle = '';
    let okBtn = null;
    this.translate.get(msgPath).subscribe(result => message = result);
    this.translate.get(titlePath ? titlePath : this.ADD_NETWORK_MSG_TITLE).subscribe(result => messageTitle = result);
    this.translate.get(okBtnPath ? okBtnPath : this.ADD_NETWORK_MSG_OK_BTN).subscribe(result => okBtn = result);
    this.notification.showDialog(messageTitle, message, false, okBtn);
  }

  /**
   * Seleted all check page or un select all on change selectAll formcontrol 
   * @param event 
   */
  seletedAllCheckPage(event) {
    this.formAddPlansModal.removeControl(this.COVERAGES_FORM_ARRAY);
    this.formAddPlansModal.addControl(this.COVERAGES_FORM_ARRAY, new FormArray([]));
    this.formAddPlansModal.updateValueAndValidity();
    this.coveragesResponse.data.forEach(element => {
      const coveragesList = this.formAddPlansModal.get(this.COVERAGES_FORM_ARRAY) as FormArray;
      /**/
      if (event.target.checked) {
        const indexNetw = this.listSelectedCoverages.findIndex(e => e.coverageKey === element.coverageKey);
        if (indexNetw === -1) {
          this.listSelectedCoverages.push(element);
          coveragesList.push(new FormControl(true, []));
        }
      } else {
        const indexNetw = this.listSelectedCoverages.findIndex(e => e.coverageKey === element.coverageKey);
        if (indexNetw !== -1) {
          this.listSelectedCoverages.splice(indexNetw, 1);
          coveragesList.push(new FormControl('', []));
        }
      }
      /**/
    });
  }
}

