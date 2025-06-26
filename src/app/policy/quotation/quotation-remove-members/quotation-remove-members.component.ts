/**
* QuotationRemoveMemberComponent
*
* @description: This class handle members remove action.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2019.
*
**/
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { PagerService } from 'src/app/shared/services/pager/pager.service';

/**
 * This class handle members remove action.
 */
@Component({
  selector: 'app-quotation-remove-members',
  templateUrl: './quotation-remove-members.component.html',
  styleUrls: ['./quotation-remove-members.component.css'],
  providers: [PagerService]
})
export class QuotationRemoveMembersComponent implements OnInit, OnDestroy {

  /**
   * Input members
   */
  @Input() membersQuote: Array<any>;

  @Input() allMembers: Array<any>;

  /**
   * Input renewal date
   */
  @Input() renewalDate: any;

  /**
   * Output updated members, emitter result
   */
  @Output()
  sendUpdatedMembers: EventEmitter<any> = new EventEmitter();

  /**
   * Constant for dependent age limit
   */
  private DEPENDENT_AGE_LIMIT = 24;

  /**
   * Total members
   */
  totalItemsToBePaged: any;

  /**
   * Object to pagination
   */
  pager: any = {};

  /**
   * Paged items
   */
  pagedItems: any[];

  /**
   * Result
   */
  result: Array<any> = [];

  /**
   * Count selected members
   */
  countSelectedMembers = 0;

  /**
   * Contructor method
   * @param notification Notification service injection
   * @param translate Translate injection
   * @param pagerService Pager service injection
   */
  constructor(
    private notification: NotificationService,
    private translate: TranslateService,
    private pagerService: PagerService
  ) { }

  /**
   * Fill members in,local variable and set page 1
   */
  ngOnInit() {
    this.fillResultArray();
    this.setPage(1);
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.membersQuote = [];
  }

  /**
   * Fill members in local variable
   */
  fillResultArray() {
    if (this.membersQuote && this.membersQuote.length > 0) {
      this.membersQuote.sort((a, b) => a.relationTypeId - b.relationTypeId);
      this.membersQuote.forEach(member => {
        this.result.push(
          {
            id: member.memberId,
            number: member.memberNumber,
            checked: member.checked,
            removed: member.removedFromQuote
          });
      });
    }
  }

  

  /**
   * Trigger action when a member is checked
   * @param memberId Member id
   */
  async checkMemberToDelete(memberId: number) {
    const findMember = this.pagedItems.find(x => x.memberId === memberId);
    if (findMember) {
      findMember.checked = !findMember.checked;
    }

    this.countSelectedMembers = await this.countSelected();
    this.sendUpdatedMembers.emit(this.membersQuote);
  }

  validateIfSpouseWasDeletedAndAddedLater(member) {
    const spouseWasDeleted = (this.pagedItems.find(x => x.checked && x.relationTypeId === 3 && x.memberId === member.memberId));
    if (spouseWasDeleted) {
      const spouseWasAddedLater = this.allMembers.find(x => x.added && x.relationTypeId === 3)
      if (spouseWasAddedLater) {
        return 'NOT';
      }
    }

    return '';
  }

  /**
   * Confirm checked members and remove from quotation object
   */
  async confirmDeleteMembers() {
    const selected = await this.countSelected();
    const title = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.CONFIRM.TITLE').toPromise();
    const confirmMessageKey = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.CONFIRM.MESSAGE').toPromise();
    const message = confirmMessageKey.replace('{0}', selected.toString());
    const yes = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.CONFIRM.YES').toPromise();
    const no = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.CONFIRM.NO').toPromise();
    const confirm = await this.notification.showDialog(title, message, true, yes, no);
    if (confirm) {
      this.countSelectedMembers = 0;
      this.sendUpdatedMembers.emit(this.membersQuote);
    }
  }

  /**
   * Confirm undo action
   * @param memberId member id
   */
  async confirmUndoRemove(memberId) {
    const title = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.UNDO.TITLE').toPromise();
    const message = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.UNDO.MESSAGE').toPromise();
    const yes = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.UNDO.YES').toPromise();
    const no = await this.translate.get('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.UNDO.NO').toPromise();
    const confirm = await this.notification.showDialog(title, message, true, yes, no);
    if (confirm) {
      const undoMember = this.membersQuote.find(x => x.memberId === memberId);
      if (undoMember) {
        undoMember.removedFromQuote = false;
        undoMember.checked = false;
        this.sendUpdatedMembers.emit(this.membersQuote);
      }
    }
  }

  /**
   * Count selected members to remove
   */
  async countSelected() {
    const countSelected = this.membersQuote.filter(x => x.checked && !x.removedFromQuote);
    return countSelected.length;
  }

  /**
   * Validate limit age (24 years old) for renewal policy
   * @param member Member object
   */
  validateDependentAge(member) {
    if (member.relationTypeId === 4) {
      const age = Utilities.calculateAge(member.dateOfBirth);
      if (age >= this.DEPENDENT_AGE_LIMIT) {
        member.checked = true;
        member.removedFromQuote = true;
        return 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.VALIDATE_DEPENDENT_24';
      }
      if (age === (this.DEPENDENT_AGE_LIMIT - 1)) {
        const currentDate = new Date();
        const renewalDate = new Date(this.renewalDate);
        const dobMember = new Date(member.dateOfBirth);
        const birthDate = new Date(currentDate.getFullYear(), dobMember.getMonth(), dobMember.getDate());

        if (renewalDate >= birthDate) {
          member.checked = true;
          member.removedFromQuote = true;
          return 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.VALIDATE_DEPENDENT';
        }
      }
    }

    return '';
  }

  /**
   * Set page for pager service
   * @param page Page
   */
  public setPage(page: number) {
    this.totalItemsToBePaged = 20;
    if (this.membersQuote) {
      if (page < 1 || page > this.pager.totalPages) {
        return;
      }
      this.pager = this.pagerService.getPager(this.membersQuote.length, page, this.totalItemsToBePaged);
      this.pagedItems = this.membersQuote.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
  }

  /**
   * Check if members was deleted
   */
  checkIfMembersWasDeleted() {
    let counted = 0;
    this.membersQuote.forEach(member => {
      if (member.removedFromQuote) {
        counted += 1;
      }
    });

    let translatedMessage = '';
    this.translate.stream('EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.DELETE_MEMBERS.DELETED').subscribe(message => {
      translatedMessage = message;
    });

    return {
      deleted: (counted > 0),
      members: counted,
      translated: translatedMessage.replace('{0}', counted.toString())
    };
  }

}
