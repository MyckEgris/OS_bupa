import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { DiagnosticResponse } from 'src/app/shared/services/common/entities/diagnostic-response';
import { FormGroup, FormControl } from '@angular/forms';
import { DiagnosticDto } from 'src/app/shared/services/common/entities/diagnostic.dto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-diagnostic',
  templateUrl: './modal-diagnostic.component.html'
})
export class ModalDiagnosticComponent implements OnInit, OnDestroy {

  @Output() diagnosticsSeleted = new EventEmitter<DiagnosticDto[]>();

  /**
   * Main form
   */
  public diagnosticForm: FormGroup;

  /***
   * List data (Information Request) for show
   */
  public  diagnostic: DiagnosticResponse = { count: 0, pageIndex: 1, pageSize: 0, data: [] };

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
   * List Diagnostics Selected
   */
  public listDiagnoticsSelected: DiagnosticDto[] = [];

  /***
   * Subscription to the service Common for get list Diagnostics
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
    this.diagnosticForm = this.buildDefaultForm();
  }

  ngOnDestroy(): void {
    this.diagnosticsSeleted = null;
    if (this.subCommon) {
      this.subCommon.unsubscribe();
    }
  }

  buildDefaultForm() {
    return new FormGroup({
      code: new FormControl(''),
      name: new FormControl(''),
    });
  }

  /***
   * Emit event when accept the list diagnostics selected
   */
  acceptDiagnosticSelected() {
    this.diagnosticsSeleted.emit(this.listDiagnoticsSelected);
    this.activeModal.close();
  }

  /***
   * Search Diagnostics
   */
  searchDiagnostics(value, page: number) {
    this.subCommon = this.commonService.getDiagnostics(page, this.PAGE_SIZE, value.code, value.name).subscribe(
      diagnostic => {
        this.searchProccess = true;
        this.collectionSize = diagnostic.count;
        this.diagnostic = diagnostic;
      },
      error => {
        this.diagnostic = { count: 0, pageIndex: 1, pageSize: 0, data: [] };
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
  changePageOfDiagnostics(page: number) {
    if (!page) { return; }
    this.page = page;
    this.searchDiagnostics(this.diagnosticForm.value, this.page);
  }

  /***
   * Save diagnostic seleted for created Pre-Authorization
   */
  seletedDiagnostic(diag: DiagnosticDto, event) {
    if (event.target.checked) {
      this.listDiagnoticsSelected.push(diag);
    } else {
      const indexDiag = this.listDiagnoticsSelected.findIndex(e => e.id === diag.id);
      this.listDiagnoticsSelected.splice(indexDiag, 1);
    }
  }

}
