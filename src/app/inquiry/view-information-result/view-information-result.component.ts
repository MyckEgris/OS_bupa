/**
* ViewInformationResultComponent.ts
*
* @description: This class shows response for inquiry request.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-06-2020.
*
**/
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CustomerService } from 'src/app/shared/services/inquiry/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { InformationRequestWizardService } from '../information-request/information-request-wizard/information-request-wizard.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';

/**
 * This class shows response for inquiry request.
 */
@Component({
  selector: 'app-view-information-result',
  templateUrl: './view-information-result.component.html'
})
export class ViewInformationResultComponent implements OnInit, OnDestroy {

  /**
   * infoResultViewForm
   */
  infoResultViewForm: FormGroup;

  /**
   * Array of inquiry documents
   */
  documents: Array<any>;

  /**
   * Inquiry ID
   */
  inquiryId: string;

  inquiryDetail: any;

  subject: any;

  public countAdded = 0;

  /**
   * Subscription
   */
  subscription: Subscription;

  seeCompleteDescription = false;

  /**
   * View child documents scroll
   */
  @ViewChild('fileScroll') fileScroll;

  /**
   * Constructor method
   * @param customerService customerServiceInjection
   * @param route routeInjection
   * @param router routerInjection
   * @param notification notificationInjection
   * @param translation translationInjection
   * @param informationRequestService informationRequestInjection
   * @param translate translateInjection
   */
  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router,
    private notification: NotificationService,
    private translation: TranslationService,
    private informationRequestService: InformationRequestWizardService,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  /**
   * Build form and recovery inquiry data
   */
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.inquiryId = params.get('inquiryId');
      this.handleInquiryResult(params.get('inquiryId'));
    });
    this.subscription = this.translate.onLangChange.subscribe(() => {
      this.inquiryDetail = this.customerService.getInquiryResultByInquiry();
      this.subject = this.inquiryDetail.subject.subjectsByLanguage
        .find(x => x.subjectLanguageId === this.translation.getLanguageId()).subjectTitle;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Validate url inquiry and sended inquiry
   * @param inquiryId Inquiry ID
   */
  validateInquirySended(inquiryId) {
    return (this.customerService.getInquiryFromInquiryResponse(inquiryId) === this.customerService.getInquiryResultByInquiry());
  }

  /**
   * Handle inquiry for render or back to search page
   * @param inquiryId Inquiry ID
   */
  handleInquiryResult(inquiryId) {
    if (this.validateInquirySended(inquiryId)) {
      this.renderResponse();
      this.getAttachments();
    } else {
      this.notification.showDialog('INQUIRY.VIEW_INFORMATION_RESULT.ERROR.VALIDATE_INQUIRY_TITLE',
        'INQUIRY.VIEW_INFORMATION_RESULT.ERROR.VALIDATE_INQUIRY_MESSAGE', false,
        'INQUIRY.VIEW_INFORMATION_RESULT.BACK').then(() => {
          this.router.navigate(['/inquiry/view-information-request']);
        });
    }
  }

  getAttachments() {
    this.customerService.getAttachmentsByInquiryId(this.inquiryId).subscribe(docs => {
      this.documents = docs.data;
    });
  }

  /**
   * Render response in form
   */
  renderResponse() {
    this.inquiryDetail = this.customerService.getInquiryResultByInquiry();
    this.subject = this.inquiryDetail.subject.subjectsByLanguage
      .find(x => x.subjectLanguageId === this.translation.getLanguageId()).subjectTitle;
  }

  /**
   * Download content inquiry response
   * @param document Document
   * @param event Event
   */
  downloadDocument(document, event) {
    this.customerService.getAttachmentContentByInquiryId(document.inquiryId, document.attachmentId).subscribe(content => {
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

  /**
   * New inquiry with response inquiry reference
   */
  createChildInquiry() {
    this.informationRequestService.setParentInquiryId(this.inquiryId);
    this.router.navigate([`/inquiry/information-request/inquiry`]);
  }

  getAddInteractionResult(result) {
    if (result === 'true' || result === true) {
      this.countAdded++;
    }
  }

  back() {
    this.destroyCurrentInquiryForBackOrCreate();
    this.router.navigate(['/inquiry/view-information-request']);
  }

  destroyCurrentInquiryForBackOrCreate() {
    this.informationRequestService.setParentInquiryId(null);
    this.informationRequestService.endInformationRequestWizard(this.auth.getUser());
    this.customerService.setInquiryResultByInquiry(null);
  }

  seeDescription(e) {
    this.seeCompleteDescription = !this.seeCompleteDescription;
    e.preventDefault();
  }

  checkIfMustToShowSeeOptions() {
    return this.inquiryDetail.description.toString().length > 100;
  }

  createInquiry() {
    this.destroyCurrentInquiryForBackOrCreate();
    this.router.navigate([`/inquiry/information-request/inquiry`]);
  }

}
