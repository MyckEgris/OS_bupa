/**
* Claim-submission.component.ts
*
* @description: This class shows agreement and claim submission wizard.
* @author Yefry Lopez.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ClaimFormWizard } from './claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from './claim-form-wizard/claim-form-wizard.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyHelperService } from 'src/app/shared/services/policy-helper/policy-helper.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

/**
 * This class shows agreement and claim submisiion wizard.
 */
@Component({
  selector: 'app-claim-form',
  templateUrl: './claim-form.component.html'
})
export class ClaimFormComponent implements OnInit, OnDestroy, AfterViewChecked {

  /**
  * ClaimSubmissionWizard Object
  */
  public wizard: ClaimFormWizard;

  /**
  * user object
  */
  private user: UserInformationModel;

  /**
  * Wizard current step inital indicator.
  */
  public currentStep = 0;

  /**
  * subWizard
  */
  public subWizard: Subscription;

  /**
   * Rol
   */
  public rol = Rol;


  /**
  * Constructor Method
  * @param claimFormWizardService Claim Submission Service Injection
  * @param router Router Injection
  * @param cdRef Change Detector Reference.
  */
  public startInactivityMxPortal: Date;
  public endInactivityMxPortal: Date;
  public today: Date;

  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private auth: AuthService,
    private cdRef: ChangeDetectorRef,
    private uploadService: UploadService,
    private policyHelper: PolicyHelperService,
    private _config: ConfigurationService
  ) {

    this.today = new Date();
    this.startInactivityMxPortal = new Date(this._config.inactivityMXPortal.split('|')[0]);
    this.endInactivityMxPortal = new Date(this._config.inactivityMXPortal.split('|')[1]);

   }

  /**
  * Ends subscription to wizard subject.
  */
  ngOnDestroy() {
    this.claimFormWizardService.endWizard();
    this.uploadService.removeAllDocuments();
    if (this.subWizard) { this.subWizard.unsubscribe(); }
  }

  /**
  * Initialize subscription for start wizard in current step.
  */
  ngOnInit() {
    debugger
    this.user = this.auth.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      (wizard: ClaimFormWizard) => { this.wizard = wizard; },
      this.currentStep, this.user
    );
  }

  /**
  * Executed after view checked.
  */
  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  inactivityPeriod(): Boolean {
    //console.log("Start: " + this.startInactivityMxPortal + " End: " + this.endInactivityMxPortal + " Hoy es: " + this.today);
    return (this.startInactivityMxPortal < this.today) && (this.today < this.endInactivityMxPortal)
  }

}
