import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { ViewTemplate } from '../../services/view-template/entities/view-template';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Router } from '@angular/router';
import { PolicyApplicationModel } from '../../services/policy-application/entities/policy-application-model';

@Component({
  selector: 'app-multi-step-wizard',
  templateUrl: './multi-step-wizard.component.html'
})
export class MultiStepWizardComponent implements OnInit {

  private user: UserInformationModel;
  viewTemplate: ViewTemplate;
  _checkPointObject: any;
  @Input()
  set checkPoint(value: any) {
    if (value) {
      this._checkPointObject = JSON.parse(value);
      if (this.stepValues.length > 0) {
        this.stepValues.find(x => x.stepNumber === this._checkPointObject.stepNumber).isCompleted = true;
      }
    }
  }
  get checkPoint() {
    return this._checkPointObject;
  }

  private _currentStep: number;
  get currentStep(): number {
    return this._currentStep;
  }
  @Input()
  set currentStep(value: number) {
    this._currentStep = value;
  }

  private _countSteps: number;
  get countSteps(): number {
      return this._countSteps;
  }
  @Input()
  set countSteps(value: number) {
    this._countSteps = value;
  }

  stepValues: MultiStep[] = [];
  constructor(private _commonService: CommonService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.getViewTemplate();
  }

  getViewTemplate() {
    this._commonService.getViewTemplate(this.user.bupa_insurance).subscribe(vt => {
        this.viewTemplate = vt;
        this.constructStepValues();
      }, error => {
        console.error('error', error);
      }, () => {} // console.error('Get View Template completed')
    );
  }

  constructStepValues() {
    this.viewTemplate.steps.forEach((element, index) => {
      this.stepValues.push(this.createMultiStep(`POLICY.POLICY_ENROLLMENT.STEP${index + 1}.TITLE`
      , `${element.sections[0].currentStep}`
      , element.stepNumber));
    });
  }

  createMultiStep(title: string, pathRoute: string, stepNumber: number): MultiStep {
    const stepValues = {
      pathRoute: pathRoute,
      title: title,
      stepNumber: stepNumber,
      isCompleted: (this.checkPoint && this.checkPoint.stepNumber >= stepNumber) ? true : false
    };
    return stepValues;
  }

  /**
   * Go to step that was fill out correctly (Locate the user to the first section,
   * not matter how long is the step, i.e, steps composed for many substeps)
   * @param step
   */
  goToStep(step: any) {
    if (this.checkPoint) {
      if (step.stepNumber <= this.checkPoint.stepNumber) {
        const next = this.viewTemplate.steps.find(st => st.stepNumber === step.stepNumber).sections.find(se => se.id === 1).currentStep;
        this.router.navigate([next]);
      }
    }
  }
}

class MultiStep {
  pathRoute: string;
  title: string;
  stepNumber: number;
  isCompleted: boolean;
}
