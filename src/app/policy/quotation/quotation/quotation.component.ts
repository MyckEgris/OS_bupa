/**
* QuotationComponent
*
* @description: This class shows step 1 of quotation wizard.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuotationWizard } from '../quotation-wizard/entities/quotation-wizard';
import { QuotationWizardService } from '../quotation-wizard/quotation-wizard.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { ActivatedRoute } from '@angular/router';

/**
 * This class shows step 1 of quotation wizard.
 */
@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit, OnDestroy {

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  /**
   * Quotation subscription
   */
  private subscription: Subscription;

  /**
   * Current step
   */
  public currentStep = 1;

  /**
   * Quotation wizard instance
   */
  public wizard: QuotationWizard;

  /**
   * Policy searched
   */
  public policy: any;

  /**
   * 
   * @param quotation Quotation wizard service inhection
   * @param route Router injection
   */
  constructor(
    private quotation: QuotationWizardService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.policy = params['policyId'];
    });
  }

  /**
   * Handle quotation wizard and save data in memory
   */
  ngOnInit() {
    this.subscription = this.quotation.beginQuotationWizard(wizard => {
      this.wizard = wizard;
      this.wizard.policyId = this.policy;
      this.setStep(this.wizard.currentStep);
    });
  }

  /**
   * Ends subscription to wizard subject
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.quotation.endQuotationWizard();
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

}
