import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Subscription, forkJoin } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Rol } from 'src/app/shared/classes/rol.enum';

@Component({
  selector: 'app-info-insured-contact',
  templateUrl: './info-insured-contact.component.html'
})
export class InfoInsuredContactComponent implements OnInit, OnDestroy {

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /***
   * Form Info Provider
   */
  public contactInformation: FormGroup;

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
   * Max chars phone
   */
  public MAX_CHARS_PHONE = 20;

  /**
   * Max chars email
   */
  public MAX_CHARS_EMAIL = 300;

  /**
   * Max chars name
   */
  public MAX_CHARS_NAME = 300;

  /**
   * Max chars relation with the customer
   */
  public MAX_CHARS_RELATION = 50;

  /**
   * Determines whether provider is
   */
  public  isProvider: boolean;

  /***
   * Show required message field when next button is pressed
   */
  @Input() showValidations = false;


  constructor(
    private authService: AuthService,
    private preAuthWizardService: PreAuthorizationWizardService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.preAuthWizardService.beginPreAuthWizardServiceWizard(
      wizard => { this.wizard = wizard; this.validateIsProvider(); }, this.user, this.currentStep);

      this.wizard.preAuthForm.addControl('contactInformation', new FormGroup({
        items: new FormArray([
          this.createItem()
        ])
     }));
  }

  validateIsProvider() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      this.isProvider = true;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.items = null;
  }

  /***
   * Created form Information Provider
   */
  createItem(): FormGroup {
    if (Number(this.user.role_id) !== Rol.PROVIDER) {
      return new  FormGroup({
        phoneInCountry: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_PHONE)]),
        phoneOutCountry: new FormControl('', [Validators.maxLength(this.MAX_CHARS_PHONE)]),
        emailAddress: new FormControl('', [Validators.required,
                CustomValidator.emailPatternValidator, Validators.maxLength(this.MAX_CHARS_EMAIL)]),
        emergencyContactName: new FormControl('', [Validators.required, Validators.maxLength(this.MAX_CHARS_NAME)]),
        emergencyContactPhone: new FormControl('', [Validators.maxLength(this.MAX_CHARS_PHONE)]),
        emergencyRelationToTheCustomer: new FormControl('', [Validators.maxLength(this.MAX_CHARS_RELATION)])
      });
    } else {
        return new  FormGroup({
          phoneInCountry: new FormControl('', [Validators.maxLength(this.MAX_CHARS_PHONE)]),
          phoneOutCountry: new FormControl('', [Validators.maxLength(this.MAX_CHARS_PHONE)]),
          emailAddress: new FormControl('', [CustomValidator.emailPatternValidator, Validators.maxLength(this.MAX_CHARS_EMAIL)]),
          emergencyContactName: new FormControl('', [Validators.maxLength(this.MAX_CHARS_NAME)]),
          emergencyContactPhone: new FormControl('', [Validators.maxLength(this.MAX_CHARS_PHONE)]),
          emergencyRelationToTheCustomer: new FormControl('', [Validators.maxLength(this.MAX_CHARS_RELATION)])
        });
    }
  }

  /***
   * Add item in the form
   */
  addItem(): void {
    this.items = this.wizard.preAuthForm.get('contactInformation').get('items') as FormArray;
    if (this.items.length < 5) {
      this.items.push(this.createItem());
    } else {
      this.showMessage();
    }
  }

  /***
   * You can enter a maximum of 5 contacts
   */
  showMessage() {
    const messageS = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.INFO_MAX_CONTACTS`);
    const tittleS = this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.INFO_MAX_CONTACTS_TITLE`);
    forkJoin([tittleS, messageS]).subscribe(async response => {
      this.notification.showDialog(response[0], response[1]);
    });

  }

  /***
   * Remove item in the form
   * @param index Index of item to remove
   */
  removeItem(index: number) {
    this.items = this.wizard.preAuthForm.get('contactInformation').get('items') as FormArray;
    this.items.removeAt(index);
  }

}
