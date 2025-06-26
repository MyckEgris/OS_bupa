import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyChangesWizard } from '../policy-changes-wizard/entities/policy-changes-wizard';
import { Subscription, forkJoin } from 'rxjs';
import { PolicyChangesWizardService } from '../policy-changes-wizard/policy-changes-wizard.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StatusPolicy } from 'src/app/shared/classes/status-policy.enum';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PolicyChangesDto } from 'src/app/shared/services/common/entities/policy-changes.dto';
import { PolicyChangesHelper } from 'src/app/shared/services/common/helper/policy-changes.helper';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { PolicyChangesStep2DefaultComponent } from '../policy-changes-step2-default/policy-changes-step2-default.component';

@Component({
  selector: 'app-policy-changes-step1',
  templateUrl: './policy-changes-step1.component.html'
})
export class PolicyChangesStep1Component implements OnInit, OnDestroy {

  /**
   * Constant for current step # 1
   */
  public currentStep = 1;

  /**
   * PolicyChangesWizard Object
   */
  public wizard: PolicyChangesWizard;

  /***
   * Subscription wizard
   */
  private subscription: Subscription;

  /***
   * Subscription commonService
   */
  private subscriptionCommonService: Subscription;

  /***
   * Subscription Policy
   */
  private subPolicy: Subscription;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * Show required message field when next button is pressed
   */
  public showValidations = false;

  /***
   * Policy statements allowed to create pre authorization
   */
  private POLICY_STATUS_IDS =
    String().concat(
      StatusPolicy.ACTIVE.toString(), ',',
      StatusPolicy.PENDING_PAYMENT.toString(), ',',
      StatusPolicy.GRACE_PERIOD.toString());


  /***
   * Const to Identify the FormGroup Step1
   */
  private STEP1 = 'step1';

  /***
   * Const to Identify the FormGroup Step2
   */
  private STEP2 = 'step2';

  /***
   * List policy changes
   */
  public listPolicyChanges: PolicyChangesDto[];

  /***
   * Validated if show input policy number
   */
  public showInputPolicyNumber = true;

  /***
   * Businessmodeid: 1 = Individual 2 = Grupal
   */
  businessmodeid: number;

  /**
   *  Search Type form control.
   */
  public SEARCH_TYPE_CTRL = 'searchType';

  /**
   *  Policy Id form control.
   */
  public POLICY_NUMBER_CTRL = 'policyNumber';

  /**
   * Search type value for policy id.
   */
  public SEARCH_TYPE_POLICY_ID = 'by_policy_id';

  /**
   * Search type value for policy legacy.
   */
  public SEARCH_TYPE_POLICY_LEGACY = 'by_legacy_policy';

  /**
   * Array for policy search types
   */
  public policySearchTypes: Array<any>;

  /**
   * Flag for policy search done.
   */
  public policySearchFlag: boolean;

  /**
   * Place holder text for policy input field.
   */
  public policyInputPlaceHolder = '';




  constructor(
    private translate: TranslateService,
    private router: Router,
    private policyChangesService: PolicyChangesWizardService,
    private authService: AuthService,
    private policyService: PolicyService,
    private notification: NotificationService,
    private commonService: CommonService,
    private translationService: TranslationService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesService.beginPolicyChangesWizardServiceWizard(
      wizard => {
        this.wizard = wizard;
        this.showPolicyNumber();
      }, this.user, this.currentStep);
    this.translate.onLangChange.subscribe(() => {
      if (this.wizard.policy) {
        this.getPolicyChanges();
      }
    });
    this.valueChanges();
    this.policySearchTypes = this.getPolicySearchTypesArray();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.subscriptionCommonService) {
      this.subscriptionCommonService.unsubscribe();
    }
    if (this.subPolicy) {
      this.subPolicy.unsubscribe();
    }
  }

  async changeStep2() {
    this.wizard.policyChange = {
      processOptionId: 1,
      processId: 1,
      roleId: 1,
      insuranceBusinessId: 41,
      processOptionName: 'changePetitioner',
      descriptionByLanguage: null,
      documents: null,
      message: null,
      description: '',
      documentsLanguage: null,
      messageLanguage: null
    };
    this.router.navigate(['policies/policy-changes/step2']);
  }


  /***
   * Show Input Policy Number
   */
  showPolicyNumber() {
    if (((Number(this.user.role_id) === Rol.GROUP_POLICY_HOLDER) ||
      (Number(this.user.role_id) === Rol.POLICY_HOLDER))) {
      this.showInputPolicyNumber = false;
      this.wizard.holderMemberId = Number(this.user.user_key);
      if (this.wizard.policyChangesForm.untouched) {
        this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).setValue(Number(this.user.user_key));
        this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).updateValueAndValidity();
        this.getFormGroup(this.STEP1).addControl(this.SEARCH_TYPE_CTRL, new FormControl(this.SEARCH_TYPE_POLICY_ID, [Validators.required]));
        this.getFormGroup(this.STEP1).get(this.SEARCH_TYPE_CTRL).updateValueAndValidity();
      }
      if (!this.wizard.policy) {
        this.searchPolicyInformation();
      }
    } else {
      this.showInputPolicyNumber = true;
      if (this.wizard.policyChangesForm.untouched) {
        this.getFormGroup(this.STEP1).addControl(this.SEARCH_TYPE_CTRL, new FormControl('', [Validators.required]));
        this.getFormGroup(this.STEP1).get(this.SEARCH_TYPE_CTRL).updateValueAndValidity();
      }
    }
  }

  /**
   * Subscribe to value changes.
   */
  valueChanges() {
    if (this.wizard) {
      this.getControl(this.STEP1, 'policyChange').valueChanges.subscribe(c => this.clearForm(c));

      this.getControl(this.STEP1, this.SEARCH_TYPE_CTRL).valueChanges.subscribe(val => {
        if (val) {
          this.policySearchFlag = false;
          this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).setValue('');
          this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).updateValueAndValidity();
          this.wizard.policy = null;
          this.getControl(this.STEP1, 'policyChange').setValue('');
          this.getControl(this.STEP1, 'policyChange').updateValueAndValidity();
          switch (this.getControl(this.STEP1, this.SEARCH_TYPE_CTRL).value) {
            case this.SEARCH_TYPE_POLICY_ID:
              this.policyInputPlaceHolder = 'CLAIMSUBMISSION.STEP1INPUTTEXT';
              break;
            case this.SEARCH_TYPE_POLICY_LEGACY:
              this.policyInputPlaceHolder = 'CLAIMSUBMISSION.STEP1INPUTTEXT02';
              break;
          }
        }
      });
    }
  }

  /**
  * Sets the policy search type array.
  */
  getPolicySearchTypesArray() {
    return [
      { value: this.SEARCH_TYPE_POLICY_ID },
      { value: this.SEARCH_TYPE_POLICY_LEGACY }
    ];
  }

  /**
   * This function allows to search the policy members according to policy search type.
   */
  searchPolicyInformation() {
    switch (this.getControl(this.STEP1, this.SEARCH_TYPE_CTRL).value) {
      case this.SEARCH_TYPE_POLICY_ID:
        this.searchPolicyInformationByPolicyId();
        break;
      case this.SEARCH_TYPE_POLICY_LEGACY:
        this.searchPolicyInformationByPolicyLegacy();
        break;
    }
  }

  /**
   * Search the policy members by policy id.
   */
  searchPolicyInformationByPolicyId() {
    this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).enable();
    this.wizard.policy = null;
    this.wizard.listPolicyChanges = [];
    this.subPolicy = this.policyService.getDetailPolicyByPolicyIdAndExclueDetail(
      this.user.role_id, this.user.user_key,
      this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).value,
      this.POLICY_STATUS_IDS, true).subscribe(
        (data: PolicyDto) => {
          this.wizard.policy = data;
          if (this.wizard.policy.isGroupPolicy) {
            this.businessmodeid = 2;
          } else {
            this.businessmodeid = 1;
          }
          this.getPolicyChanges();
        },
        error => {
          this.handleError(error, 'SEARCHPOLICY');
        });
  }

  /**
   * Search the policy members by policy legacy.
   */
  searchPolicyInformationByPolicyLegacy() {
    this.policyService.getPoliciesByFilter(
      this.user.role_id, this.user.user_key, 1, 10,
      null, null,
      this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).value,
      null, null, null, null, null, null, null, null, null
    ).subscribe(
      info => {
        const item = info.data.find(
          policy => Number(policy.legacyNumber) === Number(this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).value)
        );
        this.getControl(this.STEP1, this.POLICY_NUMBER_CTRL).enable();
        this.wizard.policy = null;
        this.wizard.listPolicyChanges = [];
        this.subPolicy = this.policyService.getDetailPolicyByPolicyIdAndExclueDetail(
          this.user.role_id, this.user.user_key,
          item.policyId,
          this.POLICY_STATUS_IDS, true).subscribe(
            (data: PolicyDto) => {
              this.wizard.policy = data;
              if (this.wizard.policy.isGroupPolicy) {
                this.businessmodeid = 2;
              } else {
                this.businessmodeid = 1;
              }
              this.getPolicyChanges();
            },
            error => {
              this.handleError(error, 'SEARCHPOLICY');
            });
      },
      error => {
        this.policySearchFlag = true;
        this.wizard.policy = null;
        console.log(error);
      });
  }


  /****
     * Get list policy changes
     */
  private getPolicyChanges() {
    this.subscriptionCommonService =
      this.commonService.getPolicyChangesByFilter(1, this.user.bupa_insurance, this.businessmodeid).subscribe(
        (policyChanges: PolicyChangesDto[]) => {
          this.wizard.listPolicyChanges =
            PolicyChangesHelper.getPolicyChangesTraslate(policyChanges, this.translationService.getLanguageId());
        },
        (error: any) => {
          this.handleError(error, 'GETPOLICYCHANGES');
        }
      );
  }


  /***
   * Evaluated type error
   */
  private handleError(error: any, origin: string) {
    if (error.status === 404) {
      if (origin === 'SEARCHPOLICY') {
        this.showMessageError(`POLICY.POLICY_CHANGES.ERROR.ERROR_MESSAGE.POLICY_NOT_FOUND`,
          `POLICY.POLICY_CHANGES.ERROR.ERROR_CODE.POLICY_NOT_FOUND`);
      } else {
        this.showMessageError(`POLICY.POLICY_CHANGES.ERROR.ERROR_MESSAGE.NOT_FOUND_CHANGES`,
          `POLICY.POLICY_CHANGES.ERROR.ERROR_CODE.POLICY_NOT_FOUND`);
      }
    } else {
      if (error.error.code === 'BE_015') {
        this.showMessageError(`POLICY.POLICY_CHANGES.ERROR.ERROR_MESSAGE.POLICY_HOLDER_NOT_VALID`,
          `POLICY.POLICY_CHANGES.ERROR.ERROR_CODE.POLICY_HOLDER_NOT_VALID`);
      }
    }
  }

  /***
   * Show message
   */
  showMessageError(messageP: string, messageTitleP: string) {
    const messageS = this.translate.get(messageP);
    const tittleS = this.translate.get(messageTitleP);

    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }


  next() {
    this.router.navigate(['policies/policy-changes/step2']);
  }


  handlePolicyChange(policyChange: PolicyChangesDto) {
    this.wizard.policyChange = policyChange;
  }

  clearForm(value: any) {
    this.wizard.documents = [];
    this.uploadService.removeAllDocuments();
    const listControl = [];
    Object.keys(this.getFormGroup(this.STEP2).controls).forEach(key => {
      listControl.push(key);
    });
    listControl.forEach(a => this.getFormGroup(this.STEP2).removeControl(a));
    this.getFormGroup(this.STEP2).addControl('description', new FormControl('', [Validators.required]));
  }

  /**
   * Get form group
   */
  public getFormGroup(formGroupName: string): FormGroup {
    return this.wizard.policyChangesForm.get(formGroupName) as FormGroup;
  }

  /***
   * Validated field valid
   */
  isFieldValid(formGroupName: string, field: string) {
    return !this.wizard.policyChangesForm.get(formGroupName).get(field).valid
      && this.wizard.policyChangesForm.get(formGroupName).get(field).touched;
  }

  /**
   * Get control
   */
  getControl(formGroupName: string, field: string) {
    return this.wizard.policyChangesForm.get(formGroupName).get(field) as FormControl;
  }

}
