import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utilities } from 'src/app/shared/util/utilities';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { QuotationAddMembersService } from './quotation-add-members.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-quotation-add-members',
  templateUrl: './quotation-add-members.component.html',
  styleUrls: ['./quotation-add-members.component.css']
})
export class QuotationAddMembersComponent implements OnInit {

  /**
   * Input members
   */
  @Input() membersQuote: Array<any>;

  @Input() allMembers: Array<any>;

  @Output()
  sendAddedMembers: EventEmitter<any> = new EventEmitter();

  /**
   * Mín Date
   */
  public minDate = new Date('1900/01/01');

  /**
   * selected Date
   */
  public selectedDate;

  /**
   * Máx date
   */
  public maxDate = new Date();

  public memberForm: FormGroup;

  public maleSelected = false;

  public femaleSelected = false;

  public addedMembers = [];

  public relation = [];

  public showValidations = false;

  public success = false;

  public update_success = false;

  public validateSpouse = false;

  /**
   * Constant for alertDisappearAlert
   */
  public alertDisappearAlert = 10000;

  constructor(
    private translate: TranslateService,
    private modalAddMemberService: QuotationAddMembersService,
    private notification: NotificationService) { }

  ngOnInit() {
    this.getAddedMembers();
    this.loadRelationType();
    this.memberForm = this.buildMemberForm();
    this.setValidators();
    this.setRelationValidators(this.relation[0].relationTypeId);

    this.memberForm.get('relationTypeId').valueChanges.subscribe(ch => {
      if (ch) {
        this.setRelationValidators(ch.relationTypeId);
      }

    });
  }

  setRelationValidators(relationTypeId) {
    if (relationTypeId === 3) {
      this.setSpouseValidator();
    }
    if (relationTypeId === 4) {
      this.setDependentValidator();
    }
  }

  getAddedMembers() {
    this.addedMembers = this.membersQuote.filter(x => x.added);
  }

  loadRelationType() {
    this.relation.length = 0;
    if (this.allMembers && this.allMembers.length > 0) {
      const existsSpouse = this.allMembers.find(x => x.relationTypeId === 3);
      if (!existsSpouse || (existsSpouse && existsSpouse.removedFromQuote)) {
        this.relation.push({ relationTypeId: 3, relationType: 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.ADD_MEMBERS.RELATIONTYPE.SPOUSE' })
      }
    }

    this.relation.push({ relationTypeId: 4, relationType: 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.ADD_MEMBERS.RELATIONTYPE.DEPENDENT' });
  
    if (this.memberForm) {
      this.memberForm.get('relationTypeId').setValue(this.relation[0]);
    }
  }

  buildMemberForm() {
    return new FormGroup({
      fullname: new FormControl(),
      dob: new FormControl(),
      relationTypeId: new FormControl(this.relation[0]),
      genre: new FormControl()
    });
  }

  setValidators() {
    this.memberForm.get('fullname').setValidators([Validators.required, Validators.minLength(5),
    Validators.maxLength(50)]);
    this.memberForm.get('dob').setValidators(Validators.required);
    this.memberForm.get('relationTypeId').setValidators(Validators.required);
    this.memberForm.get('genre').setValidators(Validators.required);
    this.memberForm.updateValueAndValidity();
  }

  setSpouseValidator() {
    this.memberForm.get('dob').setValidators([CustomValidator.isAnAdultAge,
    CustomValidator.ageRangePolicy, Validators.required]);
    this.memberForm.updateValueAndValidity();
  }

  setDependentValidator() {
    this.memberForm.get('dob').setValidators([CustomValidator.ageRangePolicyDependents, Validators.required]);
    this.memberForm.updateValueAndValidity();
  }

  onClickGender(genre) {
    switch (genre) {
      case 'male':
        this.maleSelected = true;
        this.femaleSelected = false;
        this.memberForm.get('genre').setValue(1);
        break;
      case 'female':
        this.femaleSelected = true;
        this.maleSelected = false;
        this.memberForm.get('genre').setValue(2);
        break;
    }
  }

  addMember(formValue) {

    if (!this.memberForm.valid) {
      this.showValidations = true;
      window.setTimeout(() => {
        this.showValidations = false;
      }, this.alertDisappearAlert);
      return;
    }

    if (this.validateSpouseNewMember(formValue.relationTypeId.relationTypeId)) {
      this.validateSpouse = true;
      this.showValidations = true;
      window.setTimeout(() => {
        this.validateSpouse = false;
        this.showValidations = false;
      }, this.alertDisappearAlert);
      return;
    }

    const newMember = {
      memberNumber: 0,
      memberName: formValue.fullname,
      dateOfBirth: new Date(formValue.dob),
      age: Utilities.calculateAge(formValue.dob),
      extraPremiums: [],
      gender: formValue.genre,
      relationTypeId: formValue.relationTypeId.relationTypeId,
      relationType: formValue.relationTypeId.relationType,// this.getTranslatedRelationTypeMessage(formValue.relationTypeId.relationType),
      removedFromQuote: false,
      checked: false,
      statusId: 29,
      added: true,
      id: Utilities.generateRandomId()
    };

    this.addedMembers.push(newMember);
    this.sendAddedMembers.emit(this.addedMembers);
    this.clearMember();
    this.loadRelationType();

    this.success = true;


    window.setTimeout(() => {
      this.success = false;
    }, this.alertDisappearAlert);

  }

  validateSpouseNewMember(relation) {
    const countSpouse = this.addedMembers.filter(x => x.relationTypeId === 3);
    return (countSpouse && countSpouse.length > 0 && relation === 3);
  }

  async deleteMember($event, member) {
    $event.preventDefault();
    const memberToDelete = await this.notification.showDialog('EMPLOYEE.QUOTE.QUOTATION.BUTTONS.DELETE_ADDED_MEMBER',
      'EMPLOYEE.QUOTE.QUOTATION.BUTTONS.DELETE_ADDED_MEMBER_MESSAGE', true, 
      'EMPLOYEE.QUOTE.QUOTATION.BUTTONS.DELETE_ADDED_MEMBER_YES', 
      'EMPLOYEE.QUOTE.QUOTATION.BUTTONS.DELETE_ADDED_MEMBER_NO');
    if (memberToDelete) {
      this.addedMembers.splice(this.addedMembers.indexOf(member), 1);
      this.sendAddedMembers.emit(this.addedMembers);
      this.loadRelationType();
    }
  }

  async editMember($event, member) {
    $event.preventDefault();
    const edited = await this.modalAddMemberService.showDialog(member, this.addedMembers, true);
    if (edited) {
      const memberEdited = this.addedMembers.find(x => x.id === member.id);
      this.update_success = true;
      this.loadRelationType();

      window.setTimeout(() => {
        this.update_success = false;
      }, this.alertDisappearAlert);
    }
  }

  getTranslatedRelationTypeMessage(type) {
    let message = '';
    this.translate.get(type).subscribe(mes => {
      message = mes;
    });

    return message;
  }

  clearMember() {
    this.showValidations = false;
    this.memberForm.get('fullname').reset();
    this.memberForm.get('dob').reset();
    this.memberForm.get('relationTypeId').reset();
    this.memberForm.get('genre').reset();
    this.memberForm.reset();
    this.maleSelected = false;
    this.femaleSelected = false;
  }

}
