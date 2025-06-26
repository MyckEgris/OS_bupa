
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, observable, Observable } from 'rxjs';
import 'rxjs/add/observable/fromPromise';
import { FileHelper } from '../../shared/util/file-helper';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { ConfigurationService } from '../../shared/services/configuration/configuration.service';
import { FileDocument } from '../../shared/services/common/entities/fileDocument';
import { loadingStatus } from '../../shared/services/common/entities/loadingStatus';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { NetworkService } from 'src/app/shared/services/network/network.service';
import { UploadResponse } from 'src/app/shared/services/common/entities/uploadReponse';
import { ErrorsResponseDto } from 'src/app/shared/services/network/entities/errorsResponse.dto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-load-documents',
  templateUrl: './load-documents.component.html'
})
export class LoadDocumentsComponent implements OnInit, OnDestroy {

  /**
   * Subscription save documents.
   */
  private subDocumentsSave: Subscription;

  /**
   * Subscription submit documents.
   */
  private subDocumentsSubmit: Subscription;

  /**
   * Translate key for file input
   */
  private SELECT_FILE = 'CLAIMSUBMISSION.SELECT_FILE';

  /**
   * Translate key for drag area
   */
  private DRAG_HERE = 'CLAIMSUBMISSION.DRAG_HERE';

  /**
   * Constant for define how many elements splice in documents array
   */
  private ERASE_ONE_ELEMENT = 1;

  /**
   * Constant for drop effect copy
   */
  private DROP_EFFECT_COPY = 'copy';

  /**
   * FileInput view child for access to native dom element
   */
  @ViewChild('fileInput') fileInput;

  /**
   * Uploaded Documents
   */
  public documents: any[];

  /**
   * Uploaded Documents
   */
  public errorsResponse: any;

  /**
   * Flag for dragging action
   */
  public dragging: boolean;

  /**
   * Text for file input
   */
  public selectButton: string;

  /**
   * allowed file types
   */
  public allowedTypes: string;

  /**
   * forbidden chars
   */
  public forbiddenChars: string;

  /**
   * max file size
   */
  public maxFileSize: number;

  /***
   * Constants for the policies search data not found (404) error request message.
   */
  private ERROR_DATA_TITLE = 'NETWORK.LOAD_DOCUMENTS.TITLE_01';
  private ERROR_DATA_MSG = 'POLICY.POLICY_DOCUMENTS.DATA_NOT_FOUND_ERROR_MSG';
  private ERROR_DATA_OK_BTN = 'APP.BUTTON.CONTINUE_BTN';



  /**
   * Constructor
   * @param router Router Injection
   * @param notification Notification Service Injection
   */
  constructor(
    private router: Router,
    private notification: NotificationService,
    private configuration: ConfigurationService,
    private translate: TranslateService,
    private commonService: CommonService,
    private networkService: NetworkService
  ) { }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.selectButton = this.SELECT_FILE;
    this.allowedTypes = this.configuration.networkProvidersFiles.toLowerCase()
      .split('|').map(p => p.split(':')[1]).join(',');
    this.maxFileSize = this.configuration.networkProvidersMaxFileSize;
    this.forbiddenChars = ',';
    this.documents = [];
    this.errorsResponse = { errors: [] };
  }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subDocumentsSave) { this.subDocumentsSave.unsubscribe(); }
    if (this.subDocumentsSubmit) { this.subDocumentsSubmit.unsubscribe(); }
  }


  /**
   * This Function allows open component to select a file to upload.
   */
  showFileDialog() {
    this.fileInput.nativeElement.click();
  }

  /**
   * This Function allows select files manually to upload.
   * @param e parameter to specify a files selected by the user.
   */
  manualSelectFiles(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      this.loadFiles(files);
    }
    this.fileInput.nativeElement.value = '';
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: FileDocument, e) {
    this.documents.splice(this.documents.indexOf(document), this.ERASE_ONE_ELEMENT);
    this.errorsResponse = { errors: [] };
    e.preventDefault();
  }

  /**
   * This function allow remove all documents.
   */
  async removeAllDocuments(e) {
    e.preventDefault();
    const removeTitle = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVETITLE').toPromise();
    const removeMessage = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVEMESSAGE').toPromise();
    const removeOk = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVEOK').toPromise();
    const removeCancel = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVECANCEL').toPromise();
    if (await this.notification.showDialog(removeTitle, removeMessage, true, removeOk, removeCancel)) {
      this.documents = [];
      this.errorsResponse = { errors: [] };
    }
  }

  /**
   * This function allows show a representative Icon for a specify document.
   * @param file file or document upload.
   */
  getFileIcon(file: File): string {
    const ext = '.' + file.name.toLowerCase().split('.').slice(-1)[0];
    const type = this.configuration.networkProvidersFiles.toLowerCase()
      .split('|').filter(p => p.indexOf(ext) >= 0)[0]
      .split(':')[0];
    return `fa-file-${type}-o`;
  }

  /**
   * This function allows drag over a file to upload.
   * @param e  Event that allow upload file.
   */
  dragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = this.DROP_EFFECT_COPY;
    this.dragging = true;
    this.selectButton = this.documents.length === 0 ? this.DRAG_HERE : this.SELECT_FILE;
  }

  /**
   * This function allows drag leave a file to upload.
   * @param e Event that allow upload file.
   */
  dragLeave(e: DragEvent) {
    if (!this.isDescendant(e.currentTarget, e.target)) {
      this.dragging = false;
      this.selectButton = this.SELECT_FILE;
    }
    e.preventDefault();
  }

  /**
   * This Function allows drop no valid files.
   * @param e  Event to drop files.
   */
  dropFiles(e: DragEvent) {
    e.preventDefault();
    this.dragging = false;
    this.selectButton = this.SELECT_FILE;
    this.loadFiles(e.dataTransfer.files);
  }

  /**
   * This fucntion allows calculate the size of a upload file.
   * @param file file to calculate size.
   */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  /**
   * This Function prevents unexpected behaviors during drop files.
   * @param parent Parameter parent.
   * @param child Parameter child.
   */
  isDescendant(parent, child): boolean {
    let node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  /**
   * This function allow upload files.
   * @param files File to upload.
   */
  async loadFiles(files: FileList) {
    let hasError = null;
    if (files.length + this.documents.length <= this.configuration.networkProvidersMaxFileQuantity) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const AllowedTypes = this.allowedTypes.indexOf(file.name.toLowerCase().split('.').splice(-1)[0]) >= 0;
        const fileNotAlready = this.documents.filter(p => p.file.name === file.name).length === 0;
        const fileSize = file.size <= (1048576 * this.configuration.networkProvidersMaxFileSize);
        const minSize = file.size > 0;
        const forbiddenChar = file.name.indexOf(this.forbiddenChars) === -1;
        if (AllowedTypes && fileNotAlready && fileSize && minSize && forbiddenChar) {
          this.documents.push(
            {
              loadingStatus: loadingStatus.New,
              progress: 0,
              file: file,
              icon: this.getFileIcon(file)
            });
        } else {
          hasError = [!AllowedTypes, !fileNotAlready, !fileSize, !minSize, false, !forbiddenChar];
        }
      }
    } else {
      hasError = [false, false, false, false, true, false];
    }
    if (hasError) {
      const title = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGTITLE').toPromise();
      const messageBody = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGBODY').toPromise();
      const messageTypes = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGALLOWESTYPES').toPromise();
      const messageLoaded = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGAREADYLOADED').toPromise();
      const messageSize = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGFILESIZE').toPromise();
      const messageMinSize = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGFILEMINSIZE').toPromise();
      const messageQuantity = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGFILEQUANTITY').toPromise();
      const messageForbidden = await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGFILEWITHCOMMAS').toPromise();

      let errorMessage = '';
      errorMessage += hasError[0] ? messageTypes : '';
      errorMessage += hasError[1] ? messageLoaded : '';
      errorMessage += hasError[2] ? messageSize : '';
      errorMessage += hasError[3] ? messageMinSize : '';
      errorMessage += hasError[4] ? messageQuantity : '';
      errorMessage += hasError[5] ? messageForbidden : '';

      this.notification.showDialog(title, errorMessage);

    }
  }

  /**
   * This function allows save upload files.
   */
  saveDocuments() {
    if (this.documents.length > 0) {
      const documentPromise = Observable.fromPromise(
        this.commonService.uploadFirstDocument(this.documents[0])
      );
      this.subDocumentsSave = documentPromise.subscribe(
        data => {
          this.submitDocuments(data);
        }, error => {
          console.error(error);
        }
      );
    }
  }

  /**
   * This function allows to process upload files.
   * @param response Files upload response.
   */
  submitDocuments(response: UploadResponse) {
    if (response) {
      this.errorsResponse = { errors: [] };
      this.subDocumentsSubmit = this.networkService.sendContractProcessing(response).subscribe(
        data => {
          this.errorsResponse = data;
          this.handleResponse(data);
        }, error => {
          this.handleError(error);
        }
      );
    }
  }

  /**
   * Handle request error response.
   * @param error Http Error message.
   */
  handleError(error: HttpErrorResponse) {

    if (error.status === Number('400')) {
      let response;
      let message = '';
      let messageTitle = '';
      let okBtn = null;
      this.translate.get(this.ERROR_DATA_MSG.toString()).subscribe(
        result => message = result
      );
      this.translate.get(this.ERROR_DATA_TITLE).subscribe(
        result => messageTitle = result
      );
      this.translate.get(this.ERROR_DATA_OK_BTN).subscribe(
        result => okBtn = result
      );
      response = this.notification.showDialog(messageTitle, error.error.message, false, okBtn);
      if (response) {
        this.documents = [];
        this.errorsResponse = { errors: [] };
      }
    }

  }

  /**
   * Handle successfull request response data.
   * @param data Data.
   */
  async handleResponse(data: any) {
    let response;
    let msg = '';
    let messageTitle = '';
    let okBtn = null;
    let message = '';
    this.translate.get(this.ERROR_DATA_MSG.toString()).subscribe(
      result => msg = result
    );
    this.translate.get(this.ERROR_DATA_TITLE).subscribe(
      result => messageTitle = result
    );
    this.translate.get(this.ERROR_DATA_OK_BTN).subscribe(
      result => okBtn = result
    );
    if (!data.status) {
      this.translate.get(`NETWORK.LOAD_DOCUMENTS.MSG_PARTIAL_LOAD`).subscribe(result => {
        message = result;
      });
      response = await this.notification
        .showDialog(messageTitle, message, false, okBtn);
    } else {
      this.translate.get(`NETWORK.LOAD_DOCUMENTS.MSG_STATUS_OK`).subscribe(result => {
        message = result;
      });
      response = await this.notification.showDialog(messageTitle, message, false, okBtn);
    }
    if (response && data.status) {
      this.documents = [];
      this.errorsResponse = { errors: [] };
    }
  }

  handleErrorMessage(code: string, variables: string[]) {
    if (code) {
      let messageFound = '';
      let messageToShared = '';
      this.translate.get(`NETWORK.LOAD_DOCUMENTS.ERROR_MSGS.${code}`).subscribe(
        result => {
          messageFound = result;
          let i = 0;
          for (i = 0; i < variables.length; i++) {
            const word = '{'.concat(i.toString()).concat('}');
            messageToShared = messageFound.replace(word, variables[i]);
            messageFound = messageToShared;
          }
        }
      );
      return messageFound;
    }
  }

}
