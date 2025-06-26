import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClaimUpdateWizard } from 'src/app/shared/services/claim/entities/claim-update-wizard';
import { ClaimUpdateWizardService } from 'src/app/shared/services/claim/claim-update-wizard.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { FileDocument } from 'src/app/shared/services/common/entities/fileDocument';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { loadingStatus } from 'src/app/shared/services/common/entities/loadingStatus';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';

@Component({
  selector: 'app-claim-submission-update',
  templateUrl: './claim-submission-update.component.html'
})
export class ClaimSubmissionUpdateComponent implements OnInit {

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
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScroll') fileScroll;

  public wizard: ClaimUpdateWizard;

  public claim: any;

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

  public user: any;

  constructor(
    private claimUpdate: ClaimUpdateWizardService,
    private notification: NotificationService,
    private translate: TranslateService,
    private configuration: ConfigurationService,
    private router: Router,
    private commonService: CommonService,
    private translation: TranslationService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    if (!this.claimUpdate.claim) {
      this.back();
    } else {
      this.user = this.auth.getUser();
      this.claim = this.claimUpdate.claim;
      this.initFileConfiguration();
      this.wizard = this.claimUpdate.newClaimUpdate();
    }
  }

  initFileConfiguration() {
    this.selectButton = this.SELECT_FILE;
    this.allowedTypes = this.configuration.claimSubmissionFileTypes.toLowerCase()
      .split('|').map(p => p.split(':')[1]).join(',');
    this.maxFileSize = this.configuration.claimSubmissionMaxFileSize;
    this.forbiddenChars = ',';
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
    this.wizard.documents.splice(this.wizard.documents.indexOf(document), this.ERASE_ONE_ELEMENT);
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
      this.wizard.documents = [];
    }
  }

  /**
   * This function allows show a representative Icon for a specify document.
   * @param file file or document upload.
   */
  getFileIcon(file: File): string {
    const ext = '.' + file.name.toLowerCase().split('.').slice(-1)[0];
    const type = this.configuration.claimSubmissionFileTypes.toLowerCase()
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
    this.selectButton = this.wizard.documents.length === 0 ? this.DRAG_HERE : this.SELECT_FILE;
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
   * This function allow upload files in the step2 of componen claim submission.
   * @param files File to upload.
   */
  async loadFiles(files: FileList) {
    let hasError = null;
    if (files.length + this.wizard.documents.length <= this.configuration.claimSubmissionMaxFileQuantity) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const AllowedTypes = this.allowedTypes.indexOf(file.name.toLowerCase().split('.').splice(-1)[0]) >= 0;
        const fileNotAlready = this.wizard.documents.filter(p => p.file.name === file.name).length === 0;
        const fileSize = file.size <= (1048576 * this.configuration.claimSubmissionMaxFileSize);
        const minSize = file.size > 0;
        const forbiddenChar = file.name.indexOf(this.forbiddenChars) === -1;
        if (AllowedTypes && fileNotAlready && fileSize && minSize && forbiddenChar) {
          this.wizard.documents.push(
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

  back() {
    const redirectTo = this.auth.getUser().role_id === '7' ? 'my-claims' : 'my-claims-agent';
    this.router.navigate([`claims/${redirectTo}`]);
  }

  /**
   * This function route to the next step (Step3).
   */
  next() {
    // this.router.navigate(['claims/claim-submission/step3']);
  }

  async submit() {
    try {

      const response = await this.commonService.uploadFirstDocument(this.wizard.documents[0]);
      this.wizard.folderName = response.folderName;
      if (this.wizard.documents.length > 1) {
        for (let index = 1; index < this.wizard.documents.length; index++) {
          if (index > 10) {
            this.fileScroll.nativeElement.scrollTop = ((index - 6) * 22);
          }
          await this.commonService.uploadDocumentToFolder(this.wizard.documents[index], response.folderName);
        }
      }
      this.claimUpdate.buildClaimUpdate();
      this.claimUpdate.submit(this.wizard.claimUpdateModel, this.translation.getLanguage())
        .subscribe(p => this.showSuccess(p, this.claim.claimNumber),
          async e => {
            if (this.checkIfIsBusinessException(e)) {
              const title = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
              this.notification.showDialog(title,
                e.error.message, false, 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
            } else {
              this.showError();
            }
          },
        );
    } catch {
      this.showError();
    }
  }

  /**
   * Show successful message
   * @param response Response
   */
  async showSuccess(response, claimNumber) {

    const translateMessages = [
      'CLAIMSUBMISSION.STEP3SUCCESS_TITLE',
      'CLAIMS.AGENT.SUCCESS',
      'CLAIMSUBMISSION.STEP3SUCCESSCOMPLEMENTMESSAGE'];

    const title = await this.getTranslateMessage(translateMessages[0]);
    const body = await this.getTranslateMessage(translateMessages[1]);
    const complement = await this.getTranslateMessage(translateMessages[2]);

    const result = await this.notification.showDialog(title,
      `${body}`.replace('{0}', claimNumber),
      false, 'CLAIMS.UPDATE_CLAIM.SUCCESS');
    if (result) {
      // this.back();
      this.router.navigate(['claims/my-claims-agent']);
    } else {
      // location.href = this.configuration.returnUrl;
    }
  }

  /**
   * Get translated value
   * @param key Language key
   */
  getTranslateMessage(key) {
    return this.translate.get(key).toPromise();
  }

  /**
   * Method to validate error code.
   * @param e error code return in services claim submission
   */
  validateDuplicated(e) {
    return e.error.code === 'BE_001' ||
      e.error.code === 'BE_002' ||
      e.error.code === 'BE_003' ||
      e.error.code === 'BE_004' ||
      e.error.code === 'BE_005';
  }

  /**
   *  parse message string to JSON
   * @param message Message string
   */
  parseMessage(message: string) {
    const start = message.indexOf('{');
    return JSON.parse(message.substring(start));
  }

  private checkIfIsBusinessException(error) {
    return (error.error.code.indexOf('BE_') > -1);
  }

  /**
  * Show error message
  */
  async showError() {
    const translateMessages = [
      'CLAIMSUBMISSION.STEP3ERRORTITLE',
      'CLAIMSUBMISSION.STEP3ERRORMESSAGE'];
    const title = await this.getTranslateMessage(translateMessages[0]);
    const body = await this.getTranslateMessage(translateMessages[1]);
    const result = await this.notification.showDialog(title, body, true,
      'CLAIMSUBMISSION.STEP3ERRORBUTTONOKTEXT', 'CLAIMSUBMISSION.STEP3ERRORBUTTONCANCELTEXT');
    if (!result) {
      location.href = this.configuration.returnUrl;
    }
  }

}
