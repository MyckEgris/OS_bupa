import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { Subscription, forkJoin } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-info-providers',
  templateUrl: './info-providers.component.html'
})
export class InfoProvidersComponent implements OnInit, OnDestroy {

  /***
   * Form Info Provider
   */
  public infoProviderForm: FormGroup;

  /***
   * List formControl of form Provider
   */
  public items: FormArray;

  private subscription: Subscription;

  /**
   * Constant for current step # 1
   */
  public currentStep = 1;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /***
   * Max chars facility name
   */
  public MAX_CHARS_FACILITY_NAME = 50;

  /***
   * Max chars physician name
   */
  public MAX_CHARS_PHYSICIAN_NAME = 300;

  /***
   * Max chars address
   */
  public MAX_CHARS_ADDRESS = 150;

  /***
   * Max chars phone
   */
  public MAX_CHARS_PHONE = 20;

  /***
   * Const to Identify the FormGroup infoProviderForm
   */
  private INFO_PROVIDER_FORM = 'infoProviderForm';

  /***
   * Show required message field when next button is pressed
   */
  @Input() showValidations = false;

  constructor(
    private authService: AuthService,
    private preAuthWizardService: PreAuthorizationWizardService,
    private translate: TranslateService,
    private notification: NotificationService
  ) {
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.preAuthWizardService.beginPreAuthWizardServiceWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);

    this.wizard.preAuthForm.addControl(this.INFO_PROVIDER_FORM, new FormGroup({
      items: new FormArray([
      ])
    }));

    if (this.isProvider()) {
      this.items = this.wizard.preAuthForm.get(this.INFO_PROVIDER_FORM).get('items') as FormArray;
      if (this.items.length === 0) {
        this.addItem();
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.items = null;
  }

  /***
   * Is Provider
   */
  isProvider() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      return true;
    }
  }

  /***
   * Created form Information Provider
   */
  createItem(): FormGroup {
    return new  FormGroup({
      facilityName: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_FACILITY_NAME)]),
      physicianName: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_PHYSICIAN_NAME)]),
      addressProvider: new FormControl('', Validators.maxLength(this.MAX_CHARS_ADDRESS)),
      phoneNumberProvider: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_PHONE)])
    });
  }

  /***
   * Create Information Provider Form
   * For provider role: mandatory fields
   */
  createItemProvider(): FormGroup {
    return new  FormGroup({
      facilityName: new FormControl('', [Validators.maxLength(this.MAX_CHARS_FACILITY_NAME)]),
      physicianName: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_PHYSICIAN_NAME)]),
      addressProvider: new FormControl('', Validators.maxLength(this.MAX_CHARS_ADDRESS)),
      phoneNumberProvider: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_PHONE)])
    });
  }

  /***
   * Add item in the form
   */
  addItem(): void {
    this.items = this.wizard.preAuthForm.get(this.INFO_PROVIDER_FORM).get('items') as FormArray;
    if (this.items.length < 5) {
      if (+this.user.role_id === Rol.PROVIDER) {
        this.items.push(this.createItemProvider());
      } else {
        this.items.push(this.createItem());
      }
    } else {
      this.showMessage();
    }
  }

  /***
   * You can enter a maximum of 5 providers
   */
  showMessage() {
    const messageS = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.INFO_MAX_PROVIDER`);
    const tittleS = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.INFO_MAX_PROVIDER_TITLE`);
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });

  }

  /***
   * Remove item in the form
   * @param index Index of item to remove
   */
  removeItem(index: number) {
    this.items = this.wizard.preAuthForm.get('infoProviderForm').get('items') as FormArray;
    this.items.removeAt(index);
  }

}
