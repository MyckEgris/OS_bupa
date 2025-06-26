import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogFormMultiComponent } from './dialog-form-multi/dialog-form-multi.component';
import { UploadService } from '../upload/upload.service';
import { ConfigurationService } from '../services/configuration/configuration.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-form-multi',
  templateUrl: './upload-form-multi.component.html',
  styleUrls: ['./upload-form-multi.component.css']
})
export class UploadFormMultiComponent {

  @Input() typeAttachment: string;
  @Input() fileTypes: string;
  @Input() maxFileSize: number;
  @Input() textButton?: string;
  @Input() index: number;
  @Input() nameAttachment: string;


  constructor(
    public dialog: MatDialog,
    public uploadService: UploadService,
    private config: ConfigurationService) { }

  public openUploadDialog() {
    const customTypes = this.fileTypes ? this.getCustomTypes() : null;
    const dialogRef = this.dialog.open(DialogFormMultiComponent,
      { width: '70%', height: '80%', data: { customTypes: customTypes, maxFileSize: this.maxFileSize, index: this.index, nameAttachment: this.nameAttachment } });
    dialogRef.componentInstance.typeAttachment = this.typeAttachment;
  }

  private getCustomTypes() {
    switch (this.fileTypes) {
      case 'inquiryTypes':
        return this.config.inquiryFileTypes;
      case 'preAuthFileTypes':
        return this.config.preAuthFileTypes;
      case 'changePolicyFileTypes':
        return this.config.changePolicyFileTypes;
      case 'policyAplicationFileTypes':
        return this.config.policyAplicationFileTypes;
      case 'claimSubmissionFileTypesNoXml':
        return this.config.claimSubmissionFileTypesNoXml;
      case 'interactionsFileTypes':
        return this.config.interactionsFileTypes;
      default:
        return this.config.claimSubmissionFileTypes;
    }
  }

}
