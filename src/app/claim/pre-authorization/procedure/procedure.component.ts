import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PreAuthorizationWizard } from '../pre-authorization-wizard/entities/pre-authorization-wizard';
import { PreAuthorizationWizardService } from '../pre-authorization-wizard/pre-authorization-wizard.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { ModalProcedureComponent } from './modal-procedure/modal-procedure.component';
import { ProcedureDto } from 'src/app/shared/services/common/entities/procedure.dto';

@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html'
})
export class ProcedureComponent implements OnInit, OnDestroy {

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * Subscription to Wizard
   */
  private subscriptionWizard: Subscription;

  /***
   * Subscription Procedure Modal
   */
  private subscriptionProcedureModal: Subscription;

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
  pagerProcedure: any = {};

  /**
   * stores the items Procedures per page
   *  */
  totalItemsToBePagedProcedure: number;

  /***
   * Paged Items Procedures
   */
  pagedItemsProcedures: any[];

  /***
   * List that receives the procedures selected in the modal
   */
  private newListProcedures: ProcedureDto[];

  constructor(
    private preAuthWizardService: PreAuthorizationWizardService,
    private modalService: NgbModal,
    private pagerService: PagerService
  ) { }

  ngOnInit() {
    this.subscriptionWizard = this.preAuthWizardService.beginPreAuthWizardServiceWizard(wizard => {
      this.wizard = wizard;
    }, this.user, this.currentStep);
    this.setPageProcedures(1);
  }

  ngOnDestroy(): void {
    this.subscriptionWizard.unsubscribe();
    if (this.subscriptionProcedureModal) {
      this.subscriptionProcedureModal.unsubscribe();
    }
    this.newListProcedures = null;
    this.pagedItemsProcedures = null;
  }

    /***
   * Open modal to select precedures
   */
  openModalProcedures() {
    const modalRef = this.modalService.open(ModalProcedureComponent,
      { centered: true, backdrop: 'static', keyboard: false, size: 'lg', windowClass: 'modal-claimsubmission-step3' });
    this.subscriptionProcedureModal = modalRef.componentInstance.proceduresSeleted.subscribe(($e: ProcedureDto[]) => {
      this.addProcedures($e);
    });
  }

  /***
   * Add Procedures in the list without repeat
   */
  addProcedures(lstProcedures: ProcedureDto[]) {
    this.wizard.listProcedureSelected = this.wizard.listProcedureSelected.concat(this.getListWithoutDuplicates(lstProcedures));
    this.setPageProcedures(1);
  }

  /***
   * Get List Without Duplicates
   */
  getListWithoutDuplicates(lstProcedures: ProcedureDto[]) {
      return lstProcedures.filter(e => {
        return this.wizard.listProcedureSelected.findIndex(exist => exist.id === e.id) === -1;
      });
  }

  /***
   * Pagination for procedures
   */
  setPageProcedures(page: number) {
    this.totalItemsToBePagedProcedure = 5;
    if (this.wizard.listProcedureSelected) {
      if (page < 1 || (page > this.pagerProcedure.totalPages && this.pagerProcedure.totalPages !== 0)) {
        return;
      }

      this.pagerProcedure =
        this.pagerService.getPager(this.wizard.listProcedureSelected.length, page, this.totalItemsToBePagedProcedure);
      this.pagedItemsProcedures =
        this.wizard.listProcedureSelected.slice(this.pagerProcedure.startIndex, this.pagerProcedure.endIndex + 1);
    }
  }

  /***
   * Remove procedure of the list of selected
   */
  removeProcedures(item: ProcedureDto) {
    const indexDiag = this.wizard.listProcedureSelected.findIndex(e => e.id === item.id);
    this.wizard.listProcedureSelected.splice(indexDiag, 1);
    this.setPageProcedures(1);
  }

}
