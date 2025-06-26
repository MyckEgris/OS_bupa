/**
* ClaimMenuComponent.ts
*
* @description: This class shows the options for create claim
* @author Johnny Gutierrez
* @version 1.0
* @date 08-09-2020.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { MenuOptionService } from 'src/app/security/services/menu-option/menu-option.service';

/**
 * This component shows the options for create claim
 */
@Component({
  selector: 'app-claim-menu',
  templateUrl: './claim-menu.component.html'
})
export class ClaimMenuComponent implements OnInit {
  /**
   * Create claim form.
   */
  public createClaimForm: string;

  /**
   * Create Claim Submission.
   */
  public createClaimSubmission: string;

  /**
   * Constructor of Claim Menu Component.
   */
  constructor(private router: Router,
    private menuOption: MenuOptionService) {
    localStorage.removeItem('mode');
    localStorage.removeItem('applicationId');
  }

  /**
   * Component Init.
   */
  ngOnInit() {
    debugger
    this.SetCreateClaimSubmission();
    this.setCreateClaimForm();
    this.getClaimSubmissionState();
  }

  /**
   * Set Create Claim Submission Path.
   */
  SetCreateClaimSubmission() {
    const createClaimOption = this.menuOption.state.homeLinks.find(x => x.name === 'CLAIMSUBMISSION-MASSMNGT');
    this.createClaimSubmission = createClaimOption ? createClaimOption.pathURL : '/claims/claim-submission-create-v1/massmngt';
  }

  /**
   * Set Create Claim Form Path.
   */
  setCreateClaimForm() {
    const createClaimOption = this.menuOption.state.homeLinks.find(x => x.name === 'CLAIMSUBMISSION-QUICKPAY');
    this.createClaimForm = createClaimOption ? createClaimOption.pathURL : '/claims/claim-submission-create-v2/quickpay';
  }

  /**
   * Automatic Redirect.
   */
  private getClaimSubmissionState() {
    const createClaimOption = this.menuOption.state.homeLinks.filter(x => x.name.indexOf('CLAIMSUBMISSION') > -1);
    console.log(createClaimOption, createClaimOption.length);
    switch (createClaimOption.length) {
      case 0:
        location.href = '/';
        break;
      case 1:
        this.router.navigate([`${createClaimOption[0].pathURL}`]);
        break;
      default:
        break;
    }
  }

}
