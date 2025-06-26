/**
* ViewDocumentsInformationComponent
*
* @description: This class recieve a list of documents and show it on the scream, allows
 to print them and filter then according the page's actual language.
* @author Andres Tamayo
* @version 1.0
* @date 02-13-2019.
*
**/
import { Component, Input, SimpleChanges, OnChanges} from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { DocumentOutputDto } from 'src/app/shared/services/policy/entities/documents.dto';
import { saveAs  } from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PagerService } from 'src/app/shared/services/pager/pager.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';

@Component({
  selector: 'app-view-documents-information',
  templateUrl: './view-documents-information.component.html'
})
export class ViewDocumentsInformationComponent implements OnChanges {

  /** contains an array with the document of the policy's member on the select page language */
  public filterDocuments = [];

  /**
   * Contains an array with all documents of the policy's member.
   * */
  @Input() public documents: DocumentOutputDto[];
  @Input() public documentsPermission: boolean;

  private ERROR_STATUS_FOR_DATA_NOT_FOUND: '404';

  public searchProccess: boolean;

  // pager object
  pager: any = {};

  // Shows or hides the not found message
  public dataNotFound: boolean;

  // stores the items per page
  totalItemsToBePaged: number;

  // paged items
  pagedItems: any[];

  /**
   *
   * @param translate translate service injection
   * @param _commonService common service injection
   */
  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    private _commonService: CommonService ,
    private notification: NotificationService,
    private pagerService: PagerService
  ) { }

  /** loads the page's actual language */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documents'] !== undefined) {
      if (changes['documents'].currentValue.length > 0) {
        this.getDocumentsFiltered();
        this.setPage(1);
        this.translate.onLangChange.subscribe(format => {
          this.getDocumentsFiltered();
          this.setPage(1);
        });
      } else {
        this.searchProccess = true;
        this.dataNotFound = true;
      }
    }
  }

  /**
   * Gets Policy's documents by its policy identifier.
   */
  private getDocumentsFiltered() {
      const languageId = this.translationService.getLanguageId();
      this.filterDocuments = this.documents.filter(x => x.documentLanguage === languageId);
      this.searchProccess = false;
  }

  /**
   * downloads the documents the user select on the screen
   * @param doc document
   */
  downloadFile(doc) {
    const peticion = this._commonService.getDocumentByDocumentPath(doc);
    peticion.subscribe(res => {
        const blob = new Blob([res], {type: res.type});
        saveAs(blob, doc.documentType + '.' + 'pdf');
    },
    error => {
      this.showNotFoundDocument();
    }
    );
  }

  /**
   * Shows the message when the Item was not found.
   * @param error Http Error message.
   */
  showNotFoundDocument() {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.ERROR.ERROR_CODE.404`).subscribe(
      result => messageTitle = result
    );
    this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.404`).subscribe(
      result => message = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /**
    * Check if response has error code to show business exception
    * @param error Http Error
    */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  /**
   * Check if status is 404 and show message for data not found
   * @param error Http Error
   */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  /**
   * gets the whole payment list and displays the segment from the page selected.
   * @param page page number
   */
  public setPage(page: number) {
    this.totalItemsToBePaged = 5;
    if (this.filterDocuments) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }

      this.pager = this.pagerService.getPager(this.filterDocuments.length, page, this.totalItemsToBePaged);
      this.pagedItems = this.filterDocuments.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

}
