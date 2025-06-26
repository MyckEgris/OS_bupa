import { Component, OnInit, Input } from '@angular/core';
import { InteractionDto } from 'src/app/shared/services/inquiry/entities/interaction.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-interactions-item',
  templateUrl: './interactions-item.component.html'
})
export class InteractionsItemComponent implements OnInit {

  @Input() item: InteractionDto;

  public user: any;

  /**
   * Constant for details toggle selector
   */
  private ID_DETAIL_TOGGLE = '#ig-detallereclamo-';

  constructor(
    private auth: AuthService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    const user = this.auth.getUser();
    this.user = `${user.given_name} ${user.family_name}`;
    $(this.ID_DETAIL_TOGGLE + this.item.interationId).hide();
  }

  getDocumentsByInteraction(event) {
    this.customerService.getAttachmentsByInteractionId(this.item.inquiryId, this.item.interationId).subscribe(docs => {
      this.item.documents = docs.data;
    });

    // event.preventDefault();
  }

  /**
   * Download content inquiry response
   * @param document Document
   * @param event Event
   */
  downloadDocument(document, event) {
    this.customerService.getInteractionAttachmentContentByInquiryId(this.item.inquiryId, this.item.interationId, document.attachmentId)
      .subscribe(content => {
        this.saveFile(content, document.aliasFileName, document.mimeType);
      }, error => {
        if (error.status === 302) {
          this.saveFile(error, document.aliasFileName, document.mimeType);
        }
      });

    event.preventDefault();
  }

  /**
   * Save downloaded content
   * @param content Content
   * @param fileName FileName
   * @param mimeType MimeType
   */
  saveFile(content: any, fileName: string, mimeType: string) {
    const file = new Blob([new Uint8Array(content)], { type: mimeType });
    saveAs(file, fileName);
  }

  toggleSlideAttachments() {
    $(this.ID_DETAIL_TOGGLE + this.item.interationId).slideToggle();
    if (!this.item.documents) {
      this.getDocumentsByInteraction('');
    }
  }

}
