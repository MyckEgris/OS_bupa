import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ProcedureDto } from 'src/app/shared/services/common/entities/procedure.dto';
import { FormGroup, FormControl } from '@angular/forms';
import { ProcedureResponse } from 'src/app/shared/services/common/entities/procedure-response';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-procedure',
  templateUrl: './modal-procedure.component.html'
})
export class ModalProcedureComponent implements OnInit, OnDestroy {

  @Output() proceduresSeleted = new EventEmitter<ProcedureDto[]>();

  /**
   * Main form
   */
  public procedureForm: FormGroup;

  /***
   * List data (Information Request) for show
   */
  public  procedure: ProcedureResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };

  /**
   * Collection size for pagination component
   */
  public collectionSize: number = null;

  /**
   * Init page for pagination component
   */
  private INIT_PAGE = 1;

  /**
   * Page size for pagination component
   */
  public PAGE_SIZE = 5;

  /**
   * Current page for pagination component
   */
  public page: number;

  /**
   * Flag for searching proccess
   */
  public searchProccess = false;

  /***
   * List procedures selected
   */
  public listProceduresSelected: ProcedureDto[] = [];

  /***
   * Subscription to the service Common for get list Procedures
   */
  private subCommon: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    private commonService: CommonService,
    private translate: TranslateService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.page = this.INIT_PAGE;
    this.collectionSize = 0;
    this.procedureForm = this.buildDefaultForm();
  }

  ngOnDestroy(): void {
    if (this.subCommon) {
      this.subCommon.unsubscribe();
    }
    this.listProceduresSelected = null;
  }

  buildDefaultForm() {
    return new FormGroup({
      code: new FormControl(''),
      description: new FormControl(''),
    });
  }

  /***
   * Emit event when accept the list procedures selected
   */
  acceptProceduresSelected() {
    this.proceduresSeleted.emit(this.listProceduresSelected);
    this.activeModal.close();
  }

  /***
   * Search procedures
   */
  searchProcedures(value, page: number) {
    this.subCommon = this.commonService.getProcedures(page, this.PAGE_SIZE, value.code, value.description).subscribe(
      procedure => {
        this.searchProccess = true;
        this.collectionSize = procedure.count;
        this.procedure = procedure;
      },
      error => {
        this.procedure = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
        this.collectionSize = 0;
        this.handleError(error);
      }
    );
  }

  /***
   * Evaluated type error
   */
  private handleError(error: any) {
    if (error.status === 404) {
      this.searchProccess = true;
    } else {
      console.error(error);
    }
  }

  /**
   * Updates pagination
   */
  changePageOfProcedures(page: number) {
    if (!page) { return; }
    this.page = page;
    this.searchProcedures(this.procedureForm.value, this.page);
  }

  /***
   * Save procedure seleted for created Pre-Authorization
   */
  seletedProcedure(proc: ProcedureDto, event) {
    if (event.target.checked) {
      this.listProceduresSelected.push(proc);
    } else {
      const indexDiag = this.listProceduresSelected.findIndex(e => e.id === proc.id);
      this.listProceduresSelected.splice(indexDiag, 1);
    }
  }

}
