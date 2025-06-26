import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InformationRequestWizardService } from '../../information-request/information-request-wizard/information-request-wizard.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { FileDocument } from 'src/app/shared/upload/dialog/fileDocument';
import { InteractionDocument } from 'src/app/shared/services/inquiry/entities/interaction-document';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html'
})
export class AddResponseComponent implements OnInit {

  public canAddInteraction: boolean;

  @Input() inquiryId: string;
  @Input() status?: number;
  @Output() interactionAdded = new EventEmitter();

  public documents: Array<FileDocument> = [];
  public observation: string;
  public valid = true;

  constructor(
    private informationRequestService: InformationRequestWizardService,
    private router: Router,
    private customerService: CustomerService,
    private uploadService: UploadService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.canAddInteraction = (this.status === 1);
    this.documents = this.uploadService.getDocuments();
  }

  /**
   * New inquiry with response inquiry reference
   */
  createChildInquiry() {
    this.informationRequestService.setParentInquiryId(this.inquiryId);
    this.router.navigate([`/inquiry/information-request/inquiry`]);
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: any, e) {
    this.uploadService.remove(document);
    this.documents = this.uploadService.getDocuments();
    e.preventDefault();
  }

  validateInteraction() {
    return this.observation.trim().length > 0;
  }

  async submit() {
    try {
      const validateNewInteraction = this.validateInteraction();
      if (validateNewInteraction) {
        const interactionDocuments: Array<InteractionDocument> = [];
        this.documents = this.uploadService.getDocuments();
        if (this.documents.length > 0) {
          const response = await this.commonService.uploadFirstDocument(this.documents[0]);
          interactionDocuments.push(this.addDocumentToInteraction(response, this.documents[0].file.type));
          if (this.documents.length > 1) {
            for (let index = 1; index < this.documents.length; index++) {
              const docid = await this.commonService.uploadDocumentToFolder(this.documents[index], response.folderName);
              interactionDocuments.push(this.addDocumentToInteraction(docid, this.documents[index].file.type));
            }
          }
        }

        const interaction = this.customerService.buildInteraction(this.inquiryId, this.observation, interactionDocuments);

        this.customerService.saveInteraction(interaction)
          .subscribe(p => this.showSuccess(p),
            async e => {
              this.interactionAdded.emit('false');
            }
          );
      } else {
        this.valid = false;
      }

    } catch (error) {
      this.valid = false;
      this.interactionAdded.emit('false');
    }
  }

  clearInteractionForm() {
    this.observation = '';
    this.uploadService.removeAllDocuments();
    this.documents = this.uploadService.getDocuments();
  }

  addDocumentToInteraction(response, mimeType) {
    return {
      fileName: response.fileName,
      aliasFileName: response.fileName,
      mimeType: mimeType,
      uri: `${response.folderName}\\${response.fileName}`
    };
  }

  showSuccess(response) {
    this.clearInteractionForm();
    this.interactionAdded.emit('true');
  }

}
