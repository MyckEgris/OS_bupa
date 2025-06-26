import { Component, OnInit, OnDestroy } from '@angular/core';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { DiagnosticDto } from 'src/app/shared/services/common/entities/diagnostic.dto';
import { ModalDiagnosticComponent } from './modal-diagnostic/modal-diagnostic.component';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html'
})
export class DiagnosticComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * Subscription to Wizard
   */
  private subscriptionWizard: Subscription;

  /***
   * Subscription to Modal Diagnostics
   */
  private subscriptionDiagnostics: Subscription;

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /**
   * Constant for current step # 2
   */
  public currentStep = 2;

  /**
   *  pager object
   *  */
  pagerDiagnostic: any = {};

  /**
   * stores the items Diagnostics per page
   *  */
  totalItemsToBePagedDiagnostic: number;

  /***
   * Paged Items Diagnostics
   */
  pagedItemsDiagnostics: any[];

  constructor(
    private preAuthWizardService: PreAuthorizationWizardService,
    private modalService: NgbModal,
    private pagerService: PagerService
  ) { }

  ngOnInit() {
    this.subscriptionWizard = this.preAuthWizardService.beginPreAuthWizardServiceWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);
    this.setPageDiagnostics(1);
  }

  ngOnDestroy(): void {
    this.subscriptionWizard.unsubscribe();
    if (this.subscriptionDiagnostics) {
      this.subscriptionDiagnostics.unsubscribe();
    }
    this.pagedItemsDiagnostics = null;
  }

  /***
   * Open modal to select diagnostics
   */
  openModalDiagnostics() {
    const modalRef = this.modalService.open(ModalDiagnosticComponent,
      { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'modal-claimsubmission-step3' });
    this.subscriptionDiagnostics = modalRef.componentInstance.diagnosticsSeleted.subscribe(($e: DiagnosticDto[]) => {
      this.addDiagnostics($e);
    });
  }

  /***
   * Add Diagnostics in the list without repeat
   */
  addDiagnostics(lstDiagnostics: DiagnosticDto[]) {
    this.wizard.listDiagnosticSelected = this.wizard.listDiagnosticSelected.concat(this.getListWithoutDuplicates(lstDiagnostics));
    this.setPageDiagnostics(1);
  }

  /***
   * Get List Without Duplicates
   */
  getListWithoutDuplicates(lstDiagnostics: DiagnosticDto[]) {
    return lstDiagnostics.filter(e => {
      return this.wizard.listDiagnosticSelected.findIndex(exist => exist.id === e.id) === -1;
    });
  }

  /***
   * Pagination for diagnostics
   */
  setPageDiagnostics(page: number) {
    this.totalItemsToBePagedDiagnostic = 5;
    if (this.wizard.listDiagnosticSelected) {
      if (page < 1 || (page > this.pagerDiagnostic.totalPages && this.pagerDiagnostic.totalPages !== 0)) {
        return;
      }

      this.pagerDiagnostic =
        this.pagerService.getPager(this.wizard.listDiagnosticSelected.length, page, this.totalItemsToBePagedDiagnostic);
      this.pagedItemsDiagnostics =
        this.wizard.listDiagnosticSelected.slice(this.pagerDiagnostic.startIndex, this.pagerDiagnostic.endIndex + 1);
    }
  }

  /***
   * Remove diagnostic of the list of selected
   */
  removeDiagnostics(item: DiagnosticDto) {
    const indexDiag = this.wizard.listDiagnosticSelected.findIndex(e => e.id === item.id);
    this.wizard.listDiagnosticSelected.splice(indexDiag, 1);
    this.setPageDiagnostics(1);
  }

}
