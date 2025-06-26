import { Component, OnInit, ViewChild, Inject, EventEmitter, Output, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UploadService } from '../../upload/upload.service';
import { FileHelper } from '../../util/file-helper';
import { FileUpdaloadDocuments } from '../../upload/dialog/fileUpdaloadDocuments';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../../services/notification/notification.service';
import { FileDocument } from '../../upload/dialog/fileDocument';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup } from '@angular/forms';


type MiTupla = [number, string, string];

@Component({
  selector: 'app-dialog-form-multi',
  templateUrl: './dialog-form-multi.component.html',
  styleUrls: ['./dialog-form-multi.component.css']
})
export class DialogFormMultiComponent implements OnInit {


  // miArreglo: MiTupla[] = [];
  @Output() fileName = new EventEmitter<string>();

  @Output() datosEnviados = new EventEmitter<MiTupla[]>();
  /**
    * Translate key for file input
    */
  private SELECT_FILE = 'CLAIMSUBMISSION.SELECT_FILE';

  /**
   * Translate key for drag area
   */
  private DRAG_HERE = 'CLAIMSUBMISSION.DRAG_HERE';

  /**
   * FileUpdaloadDocuments object
   */
  public wizard: FileUpdaloadDocuments = { documents: [] };

  /**
   * Constant for drop effect copy
   */
  private DROP_EFFECT_COPY = 'copy';

  /**
   * FileInput view child for access to native dom element
   */
  @ViewChild('fileInput') fileInput;


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
   * max file size
   */
  public maxFileSize: number;

  public typeAttachment: string;

  public fileNameSend: Array<any>;

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  forbiddenChars = ',';

  fileControl: FormControl;

  constructor(public dialogRef: MatDialogRef<DialogFormMultiComponent>,
    public uploadService: UploadService,
    private notification: NotificationService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public customTypes: any) {
    if (customTypes.fileControl) {
      this.fileControl = customTypes.fileControl as FormControl;
    }
  }

  ngOnInit() {
    this.wizard.documents = this.uploadService.getDocumentsByCategory(this.typeAttachment);
    const claimSubmissionFiles = this.customTypes.customTypes ? this.customTypes.customTypes : 'image:.jpeg,.jpg,.gif|pdf:.pdf|code:.xml';
    const claimSubmissionMaxFileSize = this.customTypes.maxFileSize ? +this.customTypes.maxFileSize : 10;
    this.selectButton = this.SELECT_FILE;
    this.allowedTypes = claimSubmissionFiles.split('|').map(p => p.split(':')[1]).join(',');
    this.maxFileSize = claimSubmissionMaxFileSize;

    this.fileNameSend = []
    this.fileNameSend = this.uploadService.getAllFilesIndex();


  }

  validateLength(): boolean {
    // return this.fileNameSend.some(item => { item.index === this.customTypes.index });
    const countIndexZero = this.fileNameSend.filter(item => item.index === this.customTypes.index && item.typeAttachment === this.customTypes.nameAttachment).length;
    if (countIndexZero >= 1) {
      return true;
    } else {
      return false;
    }


  }

  validateLengthCss(typeAttachment: string): boolean {
    // return this.fileNameSend.some(item => { item.index === this.customTypes.index });
    const countIndexZero = this.fileNameSend.filter(item => item.index === this.customTypes.index && item.typeAttachment === typeAttachment).length;
    if (countIndexZero >= 1) {
      return true;
    } else {
      return false;
    }


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
  async manualSelectFiles(e, index: number) {
    const title1 =  await this.translate.get('POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE_CLAIM_FORM').toPromise();
    const messageBody1 =  await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGFILEQUANTITY').toPromise();
    const title2 =  await this.translate.get('POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE_CLAIM_FORM').toPromise();
    const messageBody2 =  await this.translate.get('CLAIMSUBMISSION.STEP2WARNINGMOREXML').toPromise();
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.fileName.emit(file.name);
      if (this.customTypes.nameAttachment === 'CLAIM_BILL') {
        if (this.countXmlFiles(files, index)) {
          if (this.countFiles(index, files.length) <= 2 && files.length <= 2) {
            this.loadFiles(files, index);
          } else {
            this.notification.showDialog(title1, messageBody1);
          }
        } else {
          this.notification.showDialog(title2, messageBody2);
        }
      } else {
        this.loadFiles(files, index);
      }

    }
    this.fileInput.nativeElement.value = '';
  }

  countFiles(index: number, lengthCount: number): number {
    return this.fileNameSend.filter(item => item.index === index && item.typeAttachment === 'CLAIM_BILL').length + lengthCount;
  }

  countXmlFiles(files: File[], index: number): boolean {
    const newFiles: File[] = Array.from(files);
    let xmlCount = 0;
    newFiles.forEach(file => {
      if (file.name.endsWith('.xml')) {
        xmlCount++;
      }
    });

    const countXmlSave = this.fileNameSend.filter(p => p.typeAttachment === "CLAIM_BILL" && p.index === index && p.name.endsWith('.xml')).length;
    
    if (xmlCount != 0) {
      if (xmlCount <= 1 && countXmlSave < 1) {
        return true
      } else {
        return false;
      }
    }
    else {
      return true;
    }
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: FileDocument, index: number, name: string, typeAttachment: string, e) {
    this.uploadService.remove(document);
    this.uploadService.deleteFilesIndex(index, name, typeAttachment);
    // this.documents = this.uploadService.getDocuments();
    this.wizard.documents = this.uploadService.getDocumentsByCategory(this.typeAttachment);
    e.preventDefault();
  }


  /**
  * This function allow remove all documents.
  */
  async removeAllDocuments(e, index: number, typeAttachment: string) {
    e.preventDefault();
    const removeTitle = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVETITLE').toPromise();
    const removeMessage = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVEMESSAGE').toPromise();
    const removeOk = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVEOK').toPromise();
    const removeCancel = await this.translate.get('CLAIMSUBMISSION.STEP2REMOVECANCEL').toPromise();
    if (await this.notification.showDialog(removeTitle, removeMessage, true, removeOk, removeCancel)) {
      // this.uploadService.removeDocumentsByCategory(this.typeAttachment);
      this.uploadService.deleteFilesAllIndex(index, typeAttachment);
      this.wizard.documents = this.uploadService.getDocumentsByCategory(this.typeAttachment);
    }
  }

  /**
   * This function allows drag over a file to upload.
   * @param e  Event that allow upload file.
   */
  dragOver(e: DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = this.DROP_EFFECT_COPY;
    this.dragging = true;
    this.selectButton = this.uploadService.getDocumentsByCategory(this.typeAttachment).length === 0 ? this.DRAG_HERE : this.SELECT_FILE;
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
    // this.loadFiles(e.dataTransfer.files);
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
     * This function allow upload files in the step2 of componen claim submission.
     * @param files File to upload.
     */
  async loadFiles(files: FileList, index: number) {
    this.uploadSuccessful = true;
    let hasError = null;
    const claimSubmissionMaxFileQuantity = 100;
    const claimSubmissionMaxFileSize = this.maxFileSize;
    if (files.length + this.uploadService.getDocumentsByCategory(this.typeAttachment).length <= claimSubmissionMaxFileQuantity) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const AllowedTypes = this.allowedTypes.indexOf(file.name.toLowerCase().split('.').splice(-1)[0]) >= 0;
        const fileNotAlready = this.uploadService.getDocuments().filter(p => p.file.name === file.name).length === 0;
        const fileNotAlreadyIndex = this.uploadService.searchFile(file.name, index);
        const fileSize = file.size <= (1048576 * claimSubmissionMaxFileSize);
        const minSize = file.size > 0;
        const forbiddenChar = file.name.indexOf(this.forbiddenChars) === -1;
        if (AllowedTypes && !fileNotAlreadyIndex && fileSize && minSize && forbiddenChar) {
          this.uploadService.addDocument(file, this.typeAttachment);
          this.uploadService.addFilesIndex(index, file.name, this.typeAttachment, file);
          this.wizard.documents = this.uploadService.getDocumentsByCategory(this.typeAttachment);
        } else {

          hasError = [!AllowedTypes, fileNotAlreadyIndex, !fileSize, !minSize, false, !forbiddenChar];
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

  closeDialog() {
    return this.dialogRef.close();
  }


}
