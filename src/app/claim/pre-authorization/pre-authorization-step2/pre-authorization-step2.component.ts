import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PreAuthorizationService } from 'src/app/shared/services/claim/pre-authorization/pre-authorization.service';
import { RequestTypeDto } from 'src/app/shared/services/claim/pre-authorization/entities/request-type.dto';
import { ServiceTypeDto } from 'src/app/shared/services/claim/pre-authorization/entities/service-type.dto';
import { ServiceTypeResponse } from 'src/app/shared/services/claim/pre-authorization/entities/service-type-response';
import { RequestTypeResponse } from 'src/app/shared/services/claim/pre-authorization/entities/request-type-response';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { Router } from '@angular/router';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';

@Component({
  selector: 'app-pre-authorization-step2',
  templateUrl: './pre-authorization-step2.component.html'
})
export class PreAuthorizationStep2Component implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * Subscription wizard
   */
  private subscription: Subscription;

  /***
   * Subscription request type
   */
  private subReqType: Subscription;

  /***
   * Subscription service type
   */
  private subSerType: Subscription;

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /**
   * Constant for current step # 2
   */
  public currentStep = 2;

  /***
   * Request Date
   */
  public toDay = new Date();

  /***
   * List request type
   */
  listRequestType: RequestTypeDto[] = [];

  /***
   * List service type
   */
  listServiceType: ServiceTypeDto[] = [];

  /***
   * List of attachments
   */
  public documents: Array<any>;

  /**
   * Max chars allowed notes
   */
  public MAX_CHARS_ALLOWED_NOTES = 2000;

  public type1 = 'type1';

  /***
   * Const to Identify the FormGroup medicalInformation
   */
  private MEDICAL_INFORMATION = 'medicalInformation';

  /***
   * Show required message field when next button is pressed
   */
  public showValidations = false;

  constructor(
    private router: Router,
    private preAuthWizardService: PreAuthorizationWizardService,
    private preAuthorizationService: PreAuthorizationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private authService: AuthService,
    private uploadService: UploadService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.preAuthWizardService.beginPreAuthWizardServiceWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);
    this.documents = this.uploadService.getDocuments();
    this.createForm();
    this.getAllRequestType();
    this.getAllServiceType();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subReqType.unsubscribe();
    this.subSerType.unsubscribe();
    this.listRequestType = null;
    this.listServiceType = null;
  }

  /***
   * Add formGroup to the form created in step one.
   */
  createForm() {
    this.wizard.preAuthForm.addControl(this.MEDICAL_INFORMATION, new FormGroup({
      incurredDate: new FormControl(null, [Validators.required, CustomValidator.datePickerValidator]),
      lengthOfStayRequested: new FormControl(null, [CustomValidator.onlyInt()]),
      notes: new FormControl(null),
      requestType: new FormControl(null, [Validators.required]),
      serviceType: new FormControl(null, [Validators.required])
    }));

    this.validateProvider();
  }

  validateProvider() {
    if (Number(this.user.role_id) === Rol.PROVIDER) {
      (this.wizard.preAuthForm.get(this.MEDICAL_INFORMATION) as FormGroup)
              .addControl('admissionDate', new FormControl(null, [Validators.required]));
    } else {
      (this.wizard.preAuthForm.get(this.MEDICAL_INFORMATION) as FormGroup)
            .addControl('admissionDate', new FormControl(null));
    }
  }

  /***
   * Get All Request Type
   */
  getAllRequestType() {
    this.subReqType = this.preAuthorizationService.getRequestType().subscribe(
      (request: RequestTypeResponse) => {
        this.listRequestType = request.requestTypes;
      },
      error => {
        console.error(error);
      }
    );
  }

  /***
   * Get All Service Type
   */
  getAllServiceType() {
    this.subSerType = this.preAuthorizationService.getServiceType().subscribe(
      (service: ServiceTypeResponse) => {
        this.listServiceType = service.serviceTypes;
      },
      error => {
        console.error(error);
      }
    );
  }

  /***
   * Event of the selected service type
   */
  handleServiceTypeChange(data) {
    this.wizard.serviceType = this.listServiceType.filter(e => e.id === Number(data))[0];
  }

  /***
   * Event of the selected request type
   */
  handleRequestTypeChange(data) {
    this.wizard.requestType = this.listRequestType.filter(e => e.id === Number(data))[0];
  }

  /***
   * Get control of form
   */
  getControl(formGroupName: string, field: string) {
    return this.wizard.preAuthForm.get(formGroupName).get(field);
  }

  /***
   * Validated field valid
   */
  isFieldValid(formGroupName: string, field: string) {
    return !this.wizard.preAuthForm.get(formGroupName).get(field).valid
                  && this.wizard.preAuthForm.get(formGroupName).get(field).touched;
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: FileDocument, e) {
    this.uploadService.remove(document);
    this.documents = this.uploadService.getDocuments();
    e.preventDefault();
  }

  /***
   * Go to step 3
   */
  next() {
    if (this.wizard.preAuthForm.get(this.MEDICAL_INFORMATION).valid) {
      const descrip2000 = this.wizard.preAuthForm.get(this.MEDICAL_INFORMATION).get('notes').value;
      if (descrip2000) {
        this.wizard.preAuthForm.get(this.MEDICAL_INFORMATION).get('notes')
                    .setValue(descrip2000.substring(0, this.MAX_CHARS_ALLOWED_NOTES));
      }
      this.wizard.documents = this.uploadService.getDocuments();
      if (Number(this.user.role_id) === Rol.PROVIDER) {
        this.validateIncompleteInformation();
      } else {
        this.goToStep2();
      }
    } else {
      this.showValidations = true;
    }
  }

  /***
   * If the authenticated user is a provider,
   * You must attach at least one Document and you must add at least one diagnosis and one procedure
   */
  validateIncompleteInformation() {
    let error = false;
    if (this.wizard.documents.length < 1) {
      error = true;
      this.showMessageIncompleteInformation('CLAIMS.PRE_AUTHORIZATION.MESSAGE.STEP_2_INCOMPLETE_DOC');
    } if (this.wizard.listDiagnosticSelected.length < 1) {
      error = true;
      this.showMessageIncompleteInformation('CLAIMS.PRE_AUTHORIZATION.MESSAGE.STEP_2_INCOMPLETE_DIA');
    } if (this.wizard.listProcedureSelected.length < 1) {
      error = true;
      this.showMessageIncompleteInformation('CLAIMS.PRE_AUTHORIZATION.MESSAGE.STEP_2_INCOMPLETE_PRO');
    }

    if (!error)  {
      this.goToStep2();
    }
  }

  showMessageIncompleteInformation(message: string) {
    const messageS = this.translate.get(`${message}`);
    const tittleS =  this.translate.get(`CLAIMS.PRE_AUTHORIZATION.MESSAGE.STEP_2_INCOMPLETE_TITLE`);

    forkJoin([tittleS, messageS]).subscribe( async response => {
      this.notification.showDialog(response[0], response[1]);
    });
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    this.router.navigate(['claims/pre-authorization/step1']);
  }

  goToStep2() {
    this.router.navigate(['claims/pre-authorization/step3']);
  }

}
