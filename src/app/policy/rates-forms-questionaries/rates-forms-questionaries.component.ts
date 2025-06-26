/**
* RatesFormsQuestionariesComponent.ts
*
* @description: This component allows to download diferents documents to policy holders and agents
* @author Andres Tamayo
* @version 1.0
* @date 06-06-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonService } from '../../shared/services/common/common.service';
import { RatesDocumentsInput } from './entities/ratesDocumentsInput.dto';
import { RateDocumentOutput } from './entities/rateDocumentOutput.dto';

import { FormGroup, FormControl } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { InsuranceBusiness } from '../../shared/classes/insuranceBusiness.enum';
import { Rol } from '../../shared/classes/rol.enum';

@Component({
  selector: 'app-rates-forms-questionaries',
  templateUrl: './rates-forms-questionaries.component.html'
})
export class RatesFormsQuestionariesComponent implements OnInit, OnDestroy {


  /**
   * holds the information loaded by the resolver
   */
  public currentContract: RatesDocumentsInput;

  /**
   * holds the list of documents found after the search
   */
  public documents: RateDocumentOutput [];

  /**
   * hold the documents filtered under the current language page
   */
  public filteredDocuments: RateDocumentOutput [];

  /**
   * holds the language subscripcion
   */
  public languageSubcripcion;

  /**
   * hold the diferents languages options
   */
  public languageOptions: any[];

  /**
   * form document
   */
  formDocuments = new FormGroup({
    product: new FormControl(),
    benefic_year: new FormControl(),
    insurance_bussiness: new FormControl(),
    role_id: new FormControl(),
    referencePolicyId: new FormControl(),
    referenceGroupId: new FormControl(),
    language: new FormControl()
  });

  // pager object
  pager: any = {};

    // stores the items per page
    totalItemsToBePaged: number;

    // paged items
    pagedItems: any[];

  /**
   *
   * @param _commonService common service inyection
   * @param _route route inyection service
   * @param notification  notification information inyection service
   * @param translate  translate inyection service
   */
  constructor(
    private _commonService: CommonService,
    private _route: ActivatedRoute,
    private notification: NotificationService,
    private translate: TranslateService,
    private pagerService: PagerService
  ) {

      this.currentContract = this._route.snapshot.data['RatesDocumentsContract'].RatesDocumentsContract;

      if (this.currentContract.products.length === 0) {
        this.fillProducts();
      } else {
        this.initilizateForm();
      }
  }


  ngOnInit() {

    this.loadLanguagesOptions();

    this.languageSubcripcion = this.translate.onLangChange.subscribe(format => {
      this.loadLanguagesOptions();
    });

  }

  /**
   * destroys language subscripcion
   */
  ngOnDestroy() {
    this.languageSubcripcion.unsubscribe();
  }

  /**
   * cleans the previus search
   */
  cleanDocuments() {

    this.documents = [];
    this.filteredDocuments = [];
    this.pagedItems = [];
  }

  /** return if its necesary to show another option for year of benefit option */
  displayYearsOptions() {
    if (  Number(this.currentContract.roleId) === Rol.AGENT ||
          Number(this.currentContract.roleId) === Rol.AGENT_ASSISTANT ||
          Number(this.currentContract.roleId) === Rol.GROUP_ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * if the resolver doesnt bring productos this method has the responsability to fill it
   */
  fillProducts() {
    this._commonService.getProductByCityAndCountry (this.currentContract.bussinessId, 0, 0, false)
    .subscribe( products  => {
      this.currentContract.products = products;
      this.initilizateForm();
    });
  }

  /**
   * download the document for the user
   * @param doc
   */
  getDocument(doc: RateDocumentOutput) {

    this._commonService.getFileRatesFormDocument(doc,
       this.formDocuments.value.language, this.formDocuments.value.product,
       this.currentContract.referencePolicyId, this.currentContract.referenceGroupId
       )
    .subscribe( res => {
      const blob = new Blob([res], {type: res.type});
      saveAs(blob, `${doc.documentName}.pdf`);
    }, error => {
      this.showMessageError('NOT_FOUND');
    });

  }


  /**
   * validate special condition for sanitas bussiness and if it's ok, continues
   */
  loadDocuments() {
    if ( this.formDocuments.value.insurance_bussiness === InsuranceBusiness.SANITAS &&
         this.formDocuments.value.referencePolicyId === 0 &&
         this.formDocuments.value.referenceGroupId === 0 ) {
          this.showMessageError( 'NOT_FOUND_ANY');
    } else {
      this.searchDocuments();
    }

  }

  /**
   * look for the documents according to the form params
   */
  private searchDocuments() {
    this._commonService.getRatesFormsDocuments(this.formDocuments.value)
    .subscribe( docs  => {
      this.documents = docs;
      this.filterDocuments();
    }, error => {
      this.showMessageError('NOT_FOUND_ANY');
    });
  }

  /**
   * loads differents languages options
   */
  private loadLanguagesOptions() {

    this.translate.get(`POLICY.RATE_FORMS_QUESTIONARIES.LANGUAGE_OPTIONS`)
    .subscribe( languages => {
      this.languageOptions = languages;
    });
  }

  /**
   * filter documents to show the only the ones who correspond to the selected option
   */
  private filterDocuments() {

    if (this.documents !== undefined) {
      this.filteredDocuments = this.documents.filter(x => x.documentLanguage ===  Number(this.formDocuments.value.language));
      if (this.filteredDocuments.length === 0) {
        this.showMessageError('NOT_FOUND_ANY');
      }

      this.setPage(1);
    }
  }

  /**
   * initializate the form values
   */
  private initilizateForm() {
    this.formDocuments.setValue({
      product: this.currentContract.products[0].id,
      benefic_year: this.currentContract.dob,
      insurance_bussiness: this.currentContract.bussinessId,
      role_id: this.currentContract.roleId,
      referencePolicyId: this.currentContract.referencePolicyId,
      referenceGroupId: this.currentContract.referenceGroupId,
      language: this.currentContract.languageId
    });
  }

  /**
   * SHOW error message if not documents where found
   */
  private showMessageError(type) {
    const messageS = this.translate.get(`POLICY.RATE_FORMS_QUESTIONARIES.ERROR.${type}`);
    const tittleS = this.translate.get(`POLICY.RATE_FORMS_QUESTIONARIES.ERROR.TITLE`);

    forkJoin([tittleS, messageS]).subscribe( response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

    /**
   * gets the whole payment list and displays the segment from the page selected.
   * @param page page number
   */
  public setPage(page: number) {
    this.totalItemsToBePaged = 5;
    if (this.filteredDocuments) {
      if (page < 1 || (page > this.pager.totalPages && this.pager.totalPages !== 0) ) {
        return;
      }

      this.pager = this.pagerService.getPager(this.filteredDocuments.length, page, this.totalItemsToBePaged);
      this.pagedItems = this.filteredDocuments.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

}
