/**
* Claim-submission-step2-multi-provider.component.ts
*
* @description: This class shows step 2 of claim submission wizard for multi provider option.
* @author Yefry Lopez.
* @author Jose Daniel Hernnandez M.
* @version 1.0
* @date 01-10-2018.
* @version 2.0
* @date 13-04-2020.
*
*/

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ClaimFormFileDocument } from '../claim-form-wizard/entities/claimFormFileDocument';
import { ClaimSubmissionDocumentTypeName } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Currency } from 'src/app/shared/services/common/entities/currency';
import { HttpErrorResponse } from '@angular/common/http';
import { MedicalsService } from 'src/app/shared/services/medical-questionaries/medicals.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { MedicalQuestionary } from 'src/app/shared/services/medical-questionaries/entities/medical-questionary.model';
import { ClaimFormQuestionary } from 'src/app/shared/services/claim-submission/entities/ClaimFormQuestionary';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ClaimSubmissionFileTypeName } from 'src/app/shared/classes/claimSubmissionFileTypeName';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { concatAll } from 'rxjs/operators';
import { PolicyNatureId } from 'src/app/shared/classes/policy-nature.enum';
import { Rol } from 'src/app/shared/classes/rol.enum';
// import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';

type MiTupla = [number, string, string];
/**
 * This class shows step 2 multi provier of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step2',
  templateUrl: './claim-form-step2.component.html'
})
export class ClaimFormStep2Component implements OnInit, OnDestroy {
  /***
* variable by value keyboard_arrow_down
*/
  private ARROW_DIRECTION_DOWN = 'keyboard_arrow_down';

  /***
   * variable by value keyboard_arrow_up
   */
  private ARROW_DIRECTION_UP = 'keyboard_arrow_up';

  /**
  * Constant to identify the ClaimFormWizard current step 2
  */
  public currentStep = 3;

  /**
   * ClaimSubmissionWizard object
   */
  public wizard: ClaimFormWizard;

  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;

  /**
  * Countries instance.
  */
  public currencies: Currency[] = [];

  /**
  * Config step of policy enrollment step2 section2 component
  */
  private configStep: ViewTemplateStep;

  public showValidations = false;

  /**
   * Member Seleted.
   */
  public member: MemberOutputDto = null;

  /**
   * allowed file types
   */
  public allowedTypes: string;

  /*
  *flag for toher answer input
  */
  public isOtherAnswer = false;

  /**
   * max file size
   */
  public maxFileSize: number;

  /**
   * Documents attachment array
   */
  public documents: Array<any>;

  public fileNameSend: Array<any>;

  /**
   * Constant to identify DocType type1
   */
  public type1 = ClaimSubmissionDocumentTypeName.CLAIM_BILL;// Agregar este para los tipos Factura

  /**
   * Constant to identify DocType type2
   */
  public type2 = ClaimSubmissionDocumentTypeName.MEDICAL_RECORDS;

  /***
* variable changeArrowHospitalization
*/
  public changeArrowAccident: string = this.ARROW_DIRECTION_DOWN;

  /***
 * variable changeArrowMedicalEvents
 */
  public changeArrowMedicalEvents: string = this.ARROW_DIRECTION_UP;

  /***
  * variable changeArrowNonMedicalEvents
  */
  public changeArrowNonMedicalEvents: string = this.ARROW_DIRECTION_DOWN;

  /***
  * variable changeArrowCancelations
  */
  public changeArrowCancelations: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowHospitalization
*/
  public changeArrowHospitalization: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowProcess
*/
  public changeArrowProcess: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowTherapies
*/
  public changeArrowTherapies: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowMedicalTeam
*/
  public changeArrowMedicalTeam: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowMedicalTeam
*/
  public changeInfirmary: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowMedications
*/
  public changeArrowMedications: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowMedications
*/
  public changeArrowPreventive: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowMedications
*/
  public changeArrowAttention: string = this.ARROW_DIRECTION_DOWN;

  /***
* variable changeArrowImages
*/
  public changeArrowImages: string = this.ARROW_DIRECTION_DOWN;

  /**
   * Constant to identify DocType type3
   */
  public type3 = ClaimSubmissionDocumentTypeName.BANK_INFORMATION;

  /**
   * Constant to identify DocType type4
   */
  public type4 = ClaimSubmissionDocumentTypeName.CLAIM_DUCUMENTS;

  /**
 * file types
 */
  public fileTypes = ClaimSubmissionFileTypeName.CLAIM_SUBM_DEFAULT;

  /***
* variable changeArrowChemo
*/
  public changeArrowChemo: string = this.ARROW_DIRECTION_DOWN;

  public numberCity: number = 0;

  public indexClaim: number = 0;

  /**
   * User  of general questions1 component
   */
  private user: UserInformationModel;

  public QUESTION1_ISOTHERCLAIM_CTRL = 'isOtherCalim';
  public QUESTION1A_COMPANY_NAME_CTRL = 'companyName';
  public QUESTION2_ISRUTINE_CTRL = 'isRoutine';
  public TREATMENT_STARTDATE_CTRL = 'treatmentStartDate';
  public QUESTION_ISREFUND_CTRL = 'isRefund';
  public QUESTION_DIAGNOSTIC_CTRL = 'diagnostic';
  public QUESTION_STARTDATE_CTRL = 'diagnosticStartDate';
  public QUESTION_DIAGNOSTICDATE_CTRL = 'firstDiagnosticStartDate';
  public QUESTION_HOSPITAL_CTRL = 'isHospital';
  public QUESTION_ISACCIDENT_CTRL = 'isAccident';
  public QUESTION_PLACEDIAGNOSTIC_CTRL = 'listPlaceDiagnoctic';
  public QUESTION_OTHERANSWER_CTRL = 'otherAnswer';
  public QUESTION_HOSPITALNAME_CTRL = 'hospitalName';
  public QUESTION_HOSPITALSTARTDATE_CTRL = 'hospitalStartDate';
  public QUESTION_HOSPITALENDDATE_CTRL = 'hospitalEndDate';
  /**
   *  Start Date form control.
   */
  public START_DATE_CTRL = 'startDate';

  /**
 * Search type option question.
 */
  public SEARCH_TYPE_OPTION_AUTO = 'by_auto';

  /**
   * Search type option question.
   */
  public SEARCH_TYPE_OPTION_HOUSE = 'by_house';

  /**
   * Search type option question.
   */
  public SEARCH_TYPE_OPTION_WORK = 'by_work';

  /**
   * Search type option question.
   */
  public SEARCH_TYPE_OPTION_OTHER = 'by_other';

  /**
   * Array for policy search types
   */
  public optionsSearchTypes: Array<any>;

  /**
   * Constants for the continue process validate message
   */
  private TYPE1 = 'CLAIMSUBMISSION.STEP2TITLE01';

  private TYPE2 = 'CLAIMSUBMISSION.STEP2TITLE02';

  private TYPE3 = 'CLAIMSUBMISSION.STEP2TITLE03';

  private TYPE4 = 'CLAIMSUBMISSION.STEP2TITLE04';

  private UPLOAD_DOCUMENT_MANDATORY_TITLE = 'POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE_CLAIM_FORM';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE = 'POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE_CLAIM_FORM';

  private VALIDATE_CONTINUE = 'POLICY.APPLICATION.STEP2.VALIDATE_CONTINUE';

  private CONTINUE_MESSAGE = 'POLICY.APPLICATION.STEP2.CONTINUE_MESSAGE';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE_ONLYXML = 'POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE_ONLYXML';

  private CONTINUE_YES = 'APP.BUTTON.YES_BTN';

  private CONTINUE_NO = 'APP.BUTTON.NO_BTN';

  public MEDICAL_QUESTIONARY_NAME = 'claimFormQuestions';

  public MEDICAL_PORCESS_OPTION_ID = '71';


  /**
   * Constants for the continue process validate questionary
   */

  public MEDICAL_QUESTION_QUESTIONARY_ID = 8;

  public MEDICAL_QUESTION_LANGUAGE_ENG = 'ENG';

  public MEDICAL_QUESTION_LANGUAGE_SPA = 'SPA';

  public MEDICAL_QUESTION1_FATHER_CODE = 'CLAIMFORM1';

  public MEDICAL_QUESTION3_FATHER_CODE = 'CLAIMFORM3';

  public MEDICAL_QUESTION7_FATHER_CODE = 'CLAIMFORM7';

  public MEDICAL_ANSWER_QUESTION1 = 'true';

  /**
  * Mín Date
  */
  public minDate = new Date('1900/01/01');

  /**
   * selected Date
   */
  public selectedDate;

  /**
   * Máx date
   */
  public maxDate = new Date();

  // public minDate2 = new Date();
  public minDate2: Date[] = [];

  /**
   * selected Date
   */
  public selectedDate2;

  /**
   * Máx date
   */
  public maxDate2 = new Date();


  /**
   * Policy's country instance.
   */
  public countries: Country[] = [];

  /**
   * Questions instance.
   */
  public questions: MedicalQuestionary[] = [];


  public question1: string;
  public question1A: string;
  public question2: string;
  public question3: string;
  public question3A: string;
  public question3B: string;
  public question4: string;
  public question5: string;
  public question6: string;
  public question7: string;
  public question7A: string;
  public question7B: string;
  public question13: string;

  public answer6_1 = '';
  public other = '';
  public answer12: Date;
  public answer13: Date;

  public bandGlobal: boolean = true;

  /**
   * Show validation of preselection questions component
   */
  public showValidation = false;

  public CURRENT_SECTION = 1;

  public isExcluding = 'Sanctioned';

  isZoomed = false;


  claimVisible: boolean[] = [];

  // public claimList: FormArray;

  myForm: FormGroup;

  accordionData: BehaviorSubject<string[]>[] = [];

  // fileNames: string[][] = [];
  fileNames: { [key: number]: { [key: string]: string[] } } = {};

  selectedCurrencyCodes: string[] = [];

  forbiddenChars = ',';
  claimFormGroup: FormGroup;
  /**
   * Constructor method
   * @param claimFormWizardService Claim Submission Service Injection
   * @param router Router Injection
   * @param notification Notification Service Injection
   * @param configuration Configuration Service Injection
   * @param translate Translate Service Injection
   * @param uploadService UploadService Service Injection
   * @param medicalService Service Question
   */
  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private router: Router,
    private notification: NotificationService,
    private configuration: ConfigurationService,
    private translate: TranslateService,
    private uploadService: UploadService,
    private _commonService: CommonService,
    private medicalService: MedicalsService,
    private authService: AuthService,
    private translation: TranslationService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {

  }

  /**
  * Ends the component operation.
  */
  ngOnDestroy() {
    if (this.subWizard) { this.subWizard.unsubscribe(); }
  }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {


    this.myForm = this.fb.group({
      claimList: this.claimFormWizardService.claimList //this.fb.array([])
    });

    this.claimFormWizardService.claimList = this.myForm.get('claimList') as FormArray;

    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => {
        this.wizard = wizard;
      }, this.currentStep
    );
    if (!this.wizard.claimFormQuestionary) {
      this.wizard.claimFormQuestionary = [];
    }

    this.initiateComponent();
    this.getCurrencies();
  }

  formatToTwoDecimals(event: any): void {
    let value = event.target.value;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      event.target.value = numValue.toFixed(2);
    }
  }

  public initiateComponent() {
    if (this.wizard) {
      this.setDocuments();
      this.selectMember();
      this.getCountries();
      this.initClaim();

      // this.getQuestions();
      // this.buildControl();
      // this.validateCalendarState();
      // this.optionsSearchTypes = this.getOptionsSearchTypesArray();
      // this.translate.onLangChange.subscribe(lang => {
      //   this.getQuestions();
      // });
      // this.handleQuestions();
    }
  }

  formatAmount(value: number | string): string {
    return parseFloat(value as string).toFixed(2);
  }

  toggleChemo(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowChemo = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowChemo = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
   * Set BuildControl with Required controls.
   */
  buildControl() {
    this.getControl(this.QUESTION1_ISOTHERCLAIM_CTRL).setValidators([Validators.required]);
    this.getControl(this.QUESTION2_ISRUTINE_CTRL).setValidators([Validators.required]);
    this.getControl(this.TREATMENT_STARTDATE_CTRL).setValidators([Validators.required]);
  }

  /**
   * Questionary Value Changed.
   */
  questionaryValueChange(controlName: string) {
    switch (controlName) {
      case this.QUESTION1_ISOTHERCLAIM_CTRL:
        if (this.getControl(controlName).value === 'true') {
          this.setQuestionRequired(this.QUESTION1A_COMPANY_NAME_CTRL);
          this.setQuestionRequired(this.TREATMENT_STARTDATE_CTRL);
        } else {
          this.setQuestionNotRequired(this.QUESTION1A_COMPANY_NAME_CTRL);
          this.cleanControl(controlName);
        }
        break;

      case this.QUESTION2_ISRUTINE_CTRL:
        if (this.getControl(controlName).value === 'false') {
          this.setQuestionRequired(this.TREATMENT_STARTDATE_CTRL);
          this.setQuestionRequired(this.QUESTION_ISREFUND_CTRL);
          this.setQuestionRequired(this.QUESTION_DIAGNOSTIC_CTRL);
          this.setQuestionRequired(this.QUESTION_STARTDATE_CTRL);
          this.setQuestionRequired(this.QUESTION_DIAGNOSTICDATE_CTRL);
          this.setQuestionRequired(this.QUESTION_HOSPITAL_CTRL);
        } else {
          this.setQuestionNotRequired(this.QUESTION_ISREFUND_CTRL);
          this.setQuestionNotRequired(this.QUESTION_DIAGNOSTIC_CTRL);
          this.setQuestionNotRequired(this.QUESTION_STARTDATE_CTRL);
          this.setQuestionNotRequired(this.QUESTION_DIAGNOSTICDATE_CTRL);
          this.setQuestionNotRequired(this.QUESTION_HOSPITAL_CTRL);
          this.setQuestionNotRequired(this.QUESTION_ISACCIDENT_CTRL);
          this.setQuestionNotRequired(this.QUESTION_PLACEDIAGNOSTIC_CTRL);
          this.setQuestionNotRequired(this.QUESTION_OTHERANSWER_CTRL);
          this.cleanControl(controlName);
        }
        break;

      case this.QUESTION_ISREFUND_CTRL:
        if (this.getControl(controlName).value === 'true') {
          this.setQuestionRequired(this.QUESTION_ISACCIDENT_CTRL);
          this.setQuestionRequired(this.QUESTION_PLACEDIAGNOSTIC_CTRL);
          this.setQuestionRequired(this.TREATMENT_STARTDATE_CTRL);
        } else {
          this.setQuestionNotRequired(this.QUESTION_ISACCIDENT_CTRL);
          this.setQuestionNotRequired(this.QUESTION_PLACEDIAGNOSTIC_CTRL);
          this.cleanControl(controlName);
        }
        break;

      case this.QUESTION_PLACEDIAGNOSTIC_CTRL:
        if (this.getControl(controlName).value === this.SEARCH_TYPE_OPTION_OTHER) {
          this.setQuestionRequired(this.QUESTION_OTHERANSWER_CTRL);
          this.setQuestionRequired(this.TREATMENT_STARTDATE_CTRL);
        } else {
          this.setQuestionNotRequired(this.QUESTION_OTHERANSWER_CTRL);
          this.cleanControl(controlName);
        }
        break;

      case this.QUESTION_HOSPITAL_CTRL:
        if (this.getControl(controlName).value === 'true') {
          this.setQuestionRequired(this.QUESTION_HOSPITALNAME_CTRL);
          this.setQuestionRequired(this.TREATMENT_STARTDATE_CTRL);
          this.setQuestionRequired(this.QUESTION_HOSPITALSTARTDATE_CTRL);
          this.setQuestionRequired(this.QUESTION_HOSPITALENDDATE_CTRL);

        } else {
          this.setQuestionNotRequired(this.QUESTION_HOSPITALNAME_CTRL);
          this.setQuestionNotRequired(this.QUESTION_HOSPITALSTARTDATE_CTRL);
          this.setQuestionNotRequired(this.QUESTION_HOSPITALENDDATE_CTRL);
        }
        break;
    }
  }

  /**
   * Set Control like required.
   */
  setQuestionRequired(controlName: string) {
    this.getControl(controlName).setValidators([Validators.required]);
    this.getControl(controlName).updateValueAndValidity();
  }

  /**
   * Set Control like not required.
   */
  setQuestionNotRequired(controlName: string) {
    this.getControl(controlName).setValidators([]);
    this.getControl(controlName).updateValueAndValidity();
  }

  /**
   * Get form group
   */
  public getFormGroup(formGroupName: string): FormGroup {
    return this.wizard.searchForm.get(formGroupName) as FormGroup;
  }


  /**
  * Assing form startDate value.
  */
  private validateCalendarState() {
    this.wizard.searchForm.get(this.START_DATE_CTRL).setValue(moment().format('YYYY-MM-DD HH:mm'));
    this.wizard.searchForm.get(this.START_DATE_CTRL).updateValueAndValidity();
  }

  /**
   * Set Documents for next step.
   */
  setDocuments() {
    this.maxFileSize = this.configuration.claimSubmissionMaxFileSize;
    this.documents = [];
    this.documents = this.uploadService.getDocuments();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {

    const nextRoute = this.router.url.replace('step3', 'step2');
    this.router.navigate([`${nextRoute}`]);
  }

  cancel() {
    this.router.navigate(['']);
  }

  /**
   * This function route to the next step (Step3).
   */
  async next() {
if(this.claimFormWizardService.claimList.length > 0) {
    if (this.claimFormWizardService.getClaims().valid) {
      const title = await this.translate.get(this.VALIDATE_CONTINUE).toPromise();
      const text = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.TEXT').toPromise();
      const ok = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.OK').toPromise();
      const cancel = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.CANCEL').toPromise();
      const msg = await this.translate.get('POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_DESCRIPTION_CLAIM_FORM').toPromise();

      let valid = await this.validateXmlMexico();
      if (valid === false) {
        const canRoute = await this.continueProcess();
        if (canRoute) {
          // this.claimFormWizardService.claimListTwo = this.fb.array(this.claimFormWizardService.claimList.controls);
          this.wizard.documents = this.uploadService.getDocuments();
          const sureNext = await this.notification.showDialog(this.UPLOAD_DOCUMENT_MANDATORY_TITLE, msg , true, "Aceptar", cancel);
          if (sureNext) {
            const nextRoute = this.router.url.replace('step3', 'step6');
            this.router.navigate([`${nextRoute}`]);
          }

        }
      } else {
        const msg = await this.translate.get(this.UPLOAD_DOCUMENT_MANDATORY_MESSAGE_ONLYXML).toPromise();
        await this.notification.showDialog(this.UPLOAD_DOCUMENT_MANDATORY_TITLE,
          msg.toString().replace('{0}', ""));
      }
    } else {

      this.claimFormWizardService.getClaims().controls.forEach((group: FormGroup, index: number) => {
        if (!group.valid) {
          this.claimVisible[index] = true
          Object.keys(group.controls).forEach(key => {
            group.get(key).markAsTouched();
          });
        }
        else {
          this.claimVisible[index] = false
        }
      });
      this.cdr.detectChanges();
    }
  }
  else{
    this.initClaim()
  }
    // for (let i = 0; i <= this.claimFormWizardService.claimList.length - 1; i++) {
    //   this.claimVisible[i] = false
    // }
    // this.claimVisible[this.claimFormWizardService.claimList.length - 1] = true;
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: ClaimFormFileDocument, index: number, name: string, typeAttachment: string, e) {

    this.uploadService.remove(document);
    this.uploadService.deleteFilesIndex(index, name, typeAttachment);
    this.documents = this.uploadService.getDocuments();
    e.preventDefault();
  }

  /**
   * Select Member from UI.
   */
  selectMember() {
    this.member = this.wizard.member;
  }

  getOptionsSearchTypesArray() {
    return [
      { value: this.SEARCH_TYPE_OPTION_AUTO },
      { value: this.SEARCH_TYPE_OPTION_HOUSE },
      { value: this.SEARCH_TYPE_OPTION_WORK },
      { value: this.SEARCH_TYPE_OPTION_OTHER }
    ];
  }


  /**
   * Validates if user wants to continue whit the process.
   */
  async continueProcess() {
    let continueProcess = true;
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type2,
      await this.translate.get(this.TYPE2).toPromise(), continueProcess, true);
    return continueProcess;
  }
  /**
   * Shows process continue validation message.
   */
  async showMessageIfWishContinueForCategory(category, categoryname, continueProcess, isMandatory) {
    // if (!this.checkIfHaveDocumentsByCategory(category) && continueProcess) {
    if (this.checkIfHaveDocumentsByCategoryList() && continueProcess) {
      if (isMandatory) {
        const msg = await this.translate.get(this.UPLOAD_DOCUMENT_MANDATORY_MESSAGE).toPromise();
        await this.notification.showDialog(this.UPLOAD_DOCUMENT_MANDATORY_TITLE,
          msg.toString().replace('{0}', categoryname));
        return false;
      }
      const title = await this.translate.get(this.VALIDATE_CONTINUE).toPromise();
      const message = await this.translate.get(this.CONTINUE_MESSAGE).toPromise();
      const yes = await this.translate.get(this.CONTINUE_YES).toPromise();
      const no = await this.translate.get(this.CONTINUE_NO).toPromise();
      continueProcess = await this.notification.showDialog(title.toString().replace('{0}', categoryname),
        message.toString().replace('{0}', categoryname), true, yes, no);
    }
    return continueProcess;
  }

  validateXmlMexico(): boolean {
    let valid = false;
    for (let i = 0; i < this.claimFormWizardService.claimList.controls.length; i++) {
      let claimFormGroup = this.claimFormWizardService.claimList.controls[i];
      if (parseInt(claimFormGroup.get('countryOfServiceId').value) === 13) {
        if (!this.uploadService.searchFileXml(i)) {
          valid = true;
        }
      }
    }

    return valid;
  }

  checkIfHaveDocumentsByCategoryList() {
    let valid = false;
    for (let i = 0; i < this.claimFormWizardService.claimList.controls.length; i++) {
      if (!this.uploadService.searchFileMedical(i)) {
        valid = true;
      }
    }
    return valid;
  }

  /**
 * Checks if there are any document by type in array.
 */
  checkIfHaveDocumentsByCategory(category) {
    return this.documents.find(d => d.category === category);
  }

  /**
   * Handle the documents length.
   * @param category Category.
   */
  handleDocumentLength(category: string) {
    const docs = this.claimFormWizardService.getDocumentsByCategory(category);
    if (docs && docs.length > 0) {
      return true;
    }
  }

  /**
  * This Function allow select a country to create and associate a claim.
  * @param countryId
  */
  selectCountry($event, countryValue: number, index: number) {
    this.numberCity = countryValue;
    this.indexClaim = index;
    this.wizard.countryOfServiceId = Number(countryValue);
  }
  /**
  * Gets questions
  */
  getQuestions() {
    this.medicalService.getQuestionsClaimForm(this.MEDICAL_QUESTIONARY_NAME,
      this.MEDICAL_PORCESS_OPTION_ID, this.user.bupa_insurance).subscribe(
        result => {
          this.questions = result;
          this.validateLanguage();
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          }
        }
      );
  }

  /**
  * Loads countries for charge the select option
  */
  getCountries() {
    this._commonService.getCountries()
      .subscribe(
        result => {
          this.countries = result;
          if (!this.wizard.countryOfServiceId) {
            this.defaultCountry(this.wizard.policyHolder.policyCountryId);
          }
        },
        error => {
          if (error.error.code) {
            this.showErrorMessage(error);
          }
        }
      );
  }

  handleQuestions() {
    if (this.question1) {
      this.questions[0].medicalQuestions.forEach(question => {
        const findQuestionIsAnswered = this.wizard.claimFormQuestionary.find(x => x.medicalQuestionId === question.medicalQuestionId);
        if (findQuestionIsAnswered) {
          switch (question.medicalQuestionReference) {
            case 'CLAIMFORM1':
              this.handleQuestionsAnswer1();
              break;
            case 'CLAIMFORM1A':
              this.handleQuestionsAnswer1A();
              break;
            case 'CLAIMFORM2':
              this.handleQuestionsAnswer2();
              break;
            case 'CLAIMFORM3':
              this.handleQuestionsAnswer3();
              break;
            case 'CLAIMFORM3A':
              this.handleQuestionsAnswer3A();
              break;
            case 'CLAIMFORM3B':
              this.handleQuestionsAnswer3B(findQuestionIsAnswered.answer);
              break;
            case 'CLAIMFORM4':
              this.handleQuestionsAnswer4();
              break;
            case 'CLAIMFORM5':
              this.handleQuestionsAnswer5();
              break;
            case 'CLAIMFORM6':
              this.handleQuestionsAnswer6();
              break;
            case 'CLAIMFORM7':
              this.handleQuestionsAnswer7();
              break;
            case 'CLAIMFORM7A':
              this.handleQuestionsAnswer7A();
              break;
            case 'CLAIMFORM7B':
              this.handleQuestionsAnswer7B(findQuestionIsAnswered.answer);
              break;
            default:
              break;
          }
        }
      });
    }
  }

  whenEventIsResponse(event) {
    return (typeof (event) === 'string');
  }

  cleanControl(controlName: string) {
    switch (controlName) {

      case 'isOtherCalim':
        this.wizard.searchForm.get('companyName').reset();
        break;

      case 'isRoutine':
        this.wizard.searchForm.get('isRefund').reset();
        this.wizard.searchForm.get('isAccident').reset();
        this.wizard.searchForm.get('isHospital').reset();
        this.wizard.searchForm.get('hospitalName').reset();
        this.wizard.searchForm.get('diagnostic').reset();
        this.wizard.searchForm.get('diagnosticStartDate').reset();
        this.wizard.searchForm.get('firstDiagnosticStartDate').reset();
        this.wizard.searchForm.get('hospitalStartDate').reset();
        this.wizard.searchForm.get('hospitalEndDate').reset();
        this.wizard.searchForm.get('listPlaceDiagnoctic').reset();
        this.wizard.searchForm.get('otherAnswer').reset();
        this.isOtherAnswer = false;
        break;

      case 'isRefund':
        this.wizard.searchForm.get('isAccident').reset();
        this.wizard.searchForm.get('listPlaceDiagnoctic').reset();
        this.wizard.searchForm.get('otherAnswer').reset();
        this.isOtherAnswer = false;
        break;

      case 'isHospital':
        this.wizard.searchForm.get('hospitalName').reset();
        this.wizard.searchForm.get('hospitalStartDate').reset();
        this.wizard.searchForm.get('hospitalEndDate').reset();
        break;
    }
  }

  handleQuestionsAnswer1() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[0], this.question1,
      this.wizard.searchForm.get('isOtherCalim').value);
  }

  handleQuestionsAnswer1A() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[1], this.question1A,
      this.wizard.searchForm.get('companyName').value);
  }

  handleQuestionsAnswer2() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[2], this.question2,
      this.wizard.searchForm.get('isRoutine').value);
  }

  handleQuestionsAnswer3() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[3], this.question3,
      this.wizard.searchForm.get('isRefund').value);
  }


  handleQuestionsAnswer3A() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[4], this.question3A,
      this.wizard.searchForm.get('isAccident').value);
  }

  async handleQuestionsAnswer3B(event) {
    if (event && event.target) {
      await this.handleQuestionsAnswer3BSelect();
      // this.answer6_1 = this.wizard.searchForm.get('listPlaceDiagnoctic').value;
      this.setWizardCuestion(this.questions[0].medicalQuestions[5], this.question3B, this.answer6_1);
    }

    if (this.whenEventIsResponse(event)) {
      await this.handleQuestionsAnswer3BSelect();
      this.answer6_1 = event;
      this.setWizardCuestion(this.questions[0].medicalQuestions[5], this.question3B, this.answer6_1);
    }
  }

  async handleQuestionsAnswer3BSelect() {
    switch (this.wizard.searchForm.get('listPlaceDiagnoctic').value) {
      case this.SEARCH_TYPE_OPTION_AUTO:
        this.answer6_1 = await this.translate.get(`CLAIMFORM.QUESTIONS_QUESTION6.BY_AUTO`).toPromise();
        this.wizard.searchForm.get('otherAnswer').reset();
        this.isOtherAnswer = false;
        break;
      case this.SEARCH_TYPE_OPTION_HOUSE:
        this.answer6_1 = await this.translate.get('CLAIMFORM.QUESTIONS_QUESTION6.BY_HOUSE').toPromise();
        this.wizard.searchForm.get('otherAnswer').reset();
        this.isOtherAnswer = false;
        break;
      case this.SEARCH_TYPE_OPTION_WORK:
        this.answer6_1 = await this.translate.get('CLAIMFORM.QUESTIONS_QUESTION6.BY_WORK').toPromise();
        this.wizard.searchForm.get('otherAnswer').reset();
        this.isOtherAnswer = false;
        break;
      case this.SEARCH_TYPE_OPTION_OTHER:
        const other = await this.translate.get(`CLAIMFORM.QUESTIONS_QUESTION6.BY_OTHER`).toPromise();
        this.answer6_1 = other;
        this.isOtherAnswer = true;
        break;

      default: this.answer6_1 = '';
    }
  }

  otherAnswer(event) {
    this.other = event.target.value;
  }

  handleQuestionsAnswer4() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[6], this.question4,
      this.wizard.searchForm.get('diagnostic').value);
  }

  handleQuestionsAnswer5() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[7], this.question5,
      this.datePipe.transform(this.wizard.searchForm.get('diagnosticStartDate').value, 'yyyy-MM-dd')
    );
  }

  handleQuestionsAnswer6() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[8], this.question6,
      this.datePipe.transform(this.wizard.searchForm.get('firstDiagnosticStartDate').value, 'yyyy-MM-dd')
    );
  }

  handleQuestionsAnswer7() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[9], this.question7,
      this.wizard.searchForm.get('isHospital').value);
  }

  handleQuestionsAnswer7A() {
    this.setWizardCuestion(this.questions[0].medicalQuestions[10],
      this.question7A, this.wizard.searchForm.get('hospitalName').value);
  }

  setQuestionsAnswer7B() {
    this.answer12 = this.getControl('hospitalStartDate').value;
    this.answer13 = this.getControl('hospitalEndDate').value;
    if (this.answer12 && this.answer13) {
      const answer12and13merge = this.datePipe.transform(this.answer12, 'yyyy-MM-dd')
        + '|'
        + this.datePipe.transform(this.answer13, 'yyyy-MM-dd');
      this.setWizardCuestion(this.questions[0].medicalQuestions[11],
        this.question7B, answer12and13merge);
    }
  }

  handleQuestionsAnswer7B(answer12and13merge: string) {
    const answers = answer12and13merge.split('|');
  }

  /**
   * Shows an error message.
   * @param errorMessage error message that will be shown.
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);

  }

  /**
  * validate language user.
  * @param cuestionsform cuestion message that will be shown.
  */
  validateLanguage() {
    const currentLang = this.translation.getLanguageId();
    this.question1 = this.getQuestionByLanguage(0, currentLang);
    this.question1A = this.getQuestionByLanguage(1, currentLang);
    this.question2 = this.getQuestionByLanguage(2, currentLang);
    this.question3 = this.getQuestionByLanguage(3, currentLang);
    this.question3A = this.getQuestionByLanguage(4, currentLang);
    this.question3B = this.getQuestionByLanguage(5, currentLang);
    this.question4 = this.getQuestionByLanguage(6, currentLang);
    this.question5 = this.getQuestionByLanguage(7, currentLang);
    this.question6 = this.getQuestionByLanguage(8, currentLang);
    this.question7 = this.getQuestionByLanguage(9, currentLang);
    this.question7A = this.getQuestionByLanguage(10, currentLang);
    this.question7B = this.getQuestionByLanguage(11, currentLang);
  }

  getQuestionByLanguage(questionIndex: number, lang: number) {
    const quest = this.questions[0].medicalQuestions[questionIndex].medicalQuestionByLanguages.find(x => x.languageId === lang);
    return quest ? quest.question : '';
  }

  /**
  * Set value for claimForm.
  * @param cuestionForm
  */
  setWizardCuestion(cuestionsForm: MedicalQuestions, question: string, answer: string) {
    const cuestionary = {} as ClaimFormQuestionary;
    cuestionary.questionaryId = cuestionsForm.medicalQuestionaryId;
    cuestionary.medicalQuestionId = cuestionsForm.medicalQuestionId;
    cuestionary.medicalQuestionParentId = this.getCuestionFather(cuestionsForm);
    cuestionary.answer = answer;
    cuestionary.medicalQuestion = question;
    cuestionary.medicalQuestionObject = cuestionsForm;
    const existQuestionary = this.wizard.claimFormQuestionary.find(x => x.medicalQuestionId === cuestionsForm.medicalQuestionId);
    if (existQuestionary) {
      existQuestionary.answer = answer;
    } else {
      this.wizard.claimFormQuestionary.push(cuestionary);
    }
  }


  getCuestionFather(cuestionsForm: any) {
    if (cuestionsForm.medicalQuestionReference.includes(this.MEDICAL_QUESTION1_FATHER_CODE)) {
      const questionFather = this.questions[0].medicalQuestions
        .find(question => question.medicalQuestionReference === this.MEDICAL_QUESTION1_FATHER_CODE);
      if (questionFather && questionFather.medicalQuestionId !== cuestionsForm.medicalQuestionId) {
        return questionFather.medicalQuestionId;
      }
    }
    if (cuestionsForm.medicalQuestionReference.includes(this.MEDICAL_QUESTION3_FATHER_CODE)) {
      const questionFather = this.questions[0].medicalQuestions
        .find(question => question.medicalQuestionReference === this.MEDICAL_QUESTION3_FATHER_CODE);
      if (questionFather && questionFather.medicalQuestionId !== cuestionsForm.medicalQuestionId) {
        return questionFather.medicalQuestionId;
      }
    }
    if (cuestionsForm.medicalQuestionReference.includes(this.MEDICAL_QUESTION7_FATHER_CODE)) {
      const questionFather = this.questions[0].medicalQuestions
        .find(question => question.medicalQuestionReference === this.MEDICAL_QUESTION7_FATHER_CODE);
      if (questionFather && questionFather.medicalQuestionId !== cuestionsForm.medicalQuestionId) {
        return questionFather.medicalQuestionId;
      }
    }
    return null;
  }

  public getControl(field: string): FormControl {
    return this.wizard.searchForm.get(field) as FormControl;
  }

  defaultCountry(countryId: number) {
    this.wizard.countryOfServiceId = countryId;
  }

  /**
   * Is BTI Policy
   */
  public get handleIsBTIPolicy(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    const policyNatureIds: number[] = [PolicyNatureId.TRAVELBTI];
    return (policyNatureIds.includes(policyNatureId));
  }

  /**
 * Role is Agent or Agent Assistant
 */
  private get handleIsAgent(): boolean {
    const rolesIds = [Rol.AGENT, Rol.AGENT_ASSISTANT];
    return (rolesIds.includes(Number(this.user.role_id)));
  }

  public get isNextButtonEnabled(): boolean {
    return this.wizard.searchForm.valid && this.wizard.countryOfServiceId && this.getControl(this.TREATMENT_STARTDATE_CTRL).value;;
  }
  addForm() {
    this.claimFormGroup = this.fb.group({
      treatmentStartDate: ['', Validators.required],
      treatmentEndDate: ['', Validators.required],
      amount: ['', [Validators.required, this.twoDigitValidator]],
      currencyId: ['', Validators.required],
      countryOfServiceId: ['', Validators.required],
    });


  }

  initClaim() {
    if (this.claimFormWizardService.claimList.length === 0) {
      this.addForm();
      this.claimFormWizardService.addClaim(this.claimFormGroup);
      let claimFormGroup = this.claimFormWizardService.claimList.controls[0];
      claimFormGroup.get('treatmentStartDate').valueChanges.subscribe(newDate => {
        this.minDate2[0] = newDate;
        claimFormGroup.get('treatmentEndDate').setValue(null);
      });
      this.claimVisible[0] = true;
    } else {
      let claimListFormArray = this.claimFormWizardService.claimList;
      for (let i = 0; i < claimListFormArray.controls.length; i++) {
        let claimFormGroup = claimListFormArray.controls[i];
        let initialStartDate = claimFormGroup.get('treatmentStartDate').value;
        if (initialStartDate !== null) {
          this.minDate2[i] = initialStartDate;
          claimFormGroup.get('treatmentStartDate').valueChanges.subscribe(newDate => {
            this.minDate2[i] = newDate;
            claimFormGroup.get('treatmentEndDate').setValue(null);
          });
        } else {
          claimFormGroup.get('treatmentStartDate').valueChanges.subscribe(newDate => {
            this.minDate2[i] = newDate;
            claimFormGroup.get('treatmentEndDate').setValue(null);
          });
        }
      }
    }
    this.fileNameSend = this.uploadService.getAllFilesIndex();
  }

  twoDigitValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValid = value && /^\d+(\.\d{2})?$/.test(value);
      return isValid ? null : { 'twoDigits': { value: control.value } };
    };
  }

  toggleVisibilidad(index: number) {
    this.claimVisible[index] = !this.claimVisible[index];
  }

  toggleVisibilidadQuestions(band: boolean) {
    this.bandGlobal = !band;
  }



  async addClaimNew() {

    this.addForm();
    this.claimFormWizardService.addClaim(this.claimFormGroup);
    for (let i = 0; i <= this.claimFormWizardService.claimList.length - 1; i++) {
      this.claimVisible[i] = false
    }
    // this.claimFormGroup.get('treatmentStartDate').valueChanges.subscribe(newDate => {
    //   this.minDate2[this.claimFormWizardService.claimList.length - 1] = newDate;
    //   this.claimFormGroup.get('treatmentEndDate').setValue(null);
    // });
    let claimFormGroup = this.claimFormWizardService.claimList.controls[this.claimFormWizardService.claimList.length - 1];
    claimFormGroup.get('treatmentStartDate').valueChanges.subscribe(newDate => {
      this.minDate2[this.claimFormWizardService.claimList.length - 1] = newDate;
      claimFormGroup.get('treatmentEndDate').setValue(null);
    });
    this.claimVisible[this.claimFormWizardService.claimList.length - 1] = true;

  }




  async removeClaim(index: number) {
    await this.claimFormWizardService.removeClaim(index);
    await this.uploadService.deleteAllFilesIndex(index);
  }

  getCurrencies() {
    this._commonService.getCurrencies().subscribe(
      result => {
        this.currencies = result;
        this.currencies = this.currencies.filter(currency => currency.currencyCode !== 'MXP');
        if (!this.wizard.currencyId) {
          this.wizard.currencyId = 192;
          const currencyCode = this.currencies.find(x => x.currencyId === 192);
          this.wizard.currencyCode = currencyCode.currencyCode;
        }
      },
      error => {
        if (error.error.code) {
          this.showErrorMessage(error);
        }
      }
    );
  }
  trackByFn(index, item) {
    return index; // o un identificador único de 'item' si lo tienes
  }


  /**
   * This Function allow select a currency to create and associate a claim.
   * @param currencyCode
   */
  selectCurrency(event, currencyValue: number, index: number) {
    const currencyCode = this.currencies.find(x => x.currencyId === Number(currencyValue));
    this.wizard.currencyCode = currencyCode.currencyCode;
    this.selectedCurrencyCodes[index] = currencyCode.currencyCode;
  }
  /**
   * Function to collapse accordion medical events
   * @param toggleArrow direction
   */
  toggleMedicalEvents(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowMedicalEvents = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowMedicalEvents = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
 * Function to collapse accordion non medical events
 * @param toggleArrow direction
 */
  toggleNonMedicalEvents(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowNonMedicalEvents = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowNonMedicalEvents = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
   * Function to collapse accordion cancelations
   * @param toggleArrow direction
   */
  toggleCancelations(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowCancelations = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowCancelations = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
 * Function to collapse accordion hispotalization
 * @param toggleArrow direction
 */
  toggleHospitalization(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowHospitalization = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowHospitalization = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
 * Function to collapse accordion process
 * @param toggleArrow direction
 */
  toggleProcess(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowProcess = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowProcess = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
  * Function to collapse accordion therapies
  * @param toggleArrow direction
  */
  toggleTherapies(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowTherapies = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowTherapies = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
  * Function to collapse accordion medical team
  * @param toggleArrow direction
  */
  toggleMedicalTeam(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowMedicalTeam = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowMedicalTeam = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
* Function to collapse accordion Infirmary
* @param toggleArrow direction
*/
  toggleInfirmary(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeInfirmary = this.ARROW_DIRECTION_UP;
    } else {
      this.changeInfirmary = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
   * Function to collapse accordion medications
   * @param toggleArrow direction
   */
  toggleMedications(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowMedications = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowMedications = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
 * Function to collapse accordion preventive
 * @param toggleArrow direction
 */
  togglePreventive(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowPreventive = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowPreventive = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
* Function to collapse accordion attention
* @param toggleArrow direction
*/
  toggleAttention(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowAttention = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowAttention = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
 * Function to collapse accordion accident
 * @param toggleArrow direction
 */
  toggleAccident(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowAccident = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowAccident = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
 * Function to collapse accordion images
 * @param toggleArrow direction
 */
  toggleImages(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowImages = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowImages = this.ARROW_DIRECTION_DOWN;
    }
  }

  handleFileSelected(event: { files: FileList, index: number }) {
    const { files, index } = event;
  }

  getTotalCount(index: number): number {
    return this.fileNameSend.filter(document => document.index === index).length;
  }

  toggleCardZoom(e) {
    this.isZoomed = !this.isZoomed;
    if (this.isZoomed) {
      setTimeout(() => {
        this.isZoomed = !this.isZoomed;
      }, 3000);
    }
    e.preventDefault();
  }

}
