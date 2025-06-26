import { Component, ViewChild, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';
import { UploadService } from './upload.service';
import { ConfigurationService } from '../services/configuration/configuration.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  @Input() typeAttachment: string;
  @Input() fileTypes: string;
  @Input() maxFileSize: number;
  @Input() textButton?: string;

  constructor(
    public dialog: MatDialog,
    public uploadService: UploadService,
    private config: ConfigurationService) { }

  public openUploadDialog() {
    const customTypes = this.fileTypes ? this.getCustomTypes() : null;
    console.log(customTypes);
    const dialogRef = this.dialog.open(DialogComponent,
      { width: '70%', height: '80%', data: { customTypes: customTypes, maxFileSize: this.maxFileSize } });
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

