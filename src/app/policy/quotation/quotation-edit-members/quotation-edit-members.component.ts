import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-quotation-edit-members',
  templateUrl: './quotation-edit-members.component.html',
  styleUrls: ['./quotation-edit-members.component.css']
})
export class QuotationEditMembersComponent implements OnInit {

  public memberForm: FormGroup;

  public member: any;

  public addedMembers: Array<any>;

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

  public maleSelected = false;

  public femaleSelected = false;

  public showValidations = false;

  public relation = [];

  public result: any;

  /**
   * Indicates if close window
   */
  public closeWindow: boolean;

  public alertDisappearAlert = 10000;

  public relationTypeId: any;

  public validateSpouse = false;

  constructor(public activeModal: NgbActiveModal, public translate: TranslateService) { }

  ngOnInit() {
    this.loadRelationType();
    const relationIndex = this.relation.findIndex(x => x.relationTypeId === this.member.relationTypeId);
    this.relationTypeId = this.relation[relationIndex].relationTypeId;
    this.memberForm = this.buildMemberForm();
    this.setValidators();
    this.setRelationValidators(this.relationTypeId)
    this.setValues(relationIndex);

    this.maleSelected = this.member.gender === 1;
    this.femaleSelected = this.member.gender === 2;
    this.memberForm.get('relationTypeId').setValue(this.relation[relationIndex]);

    this.memberForm.get('relationTypeId').valueChanges.subscribe(ch => {
      if (ch) {
        this.setRelationValidators(ch.relationTypeId);
      }
    });

    this.memberForm.get('dob').valueChanges.subscribe(ch => {
      this.setRelationValidators(this.relationTypeId);
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

  buildMemberForm() {
    return new FormGroup({
      fullname: new FormControl(this.member.memberName),
      dob: new FormControl(this.member.dateOfBirth),
      relationTypeId: new FormControl(this.member.relationTypeId),
      genre: new FormControl(this.member.gender)
    });
  }

  setValues(relationIndex) {
    this.memberForm.get('fullname').setValue(this.member.memberName);
    this.memberForm.get('dob').setValue(this.member.dateOfBirth);
    this.memberForm.get('relationTypeId').setValue(this.relation[relationIndex]);
    this.memberForm.get('genre').setValue(this.member.gender);
  }

  loadRelationType() {
    // const existsSpouse = this.membersQuote.find(x => x.relationTypeId === 3);
    // if (!existsSpouse || (existsSpouse && existsSpouse.removedFromQuote)) {
    this.relation.push({ relationTypeId: 3, relationType: 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.ADD_MEMBERS.RELATIONTYPE.SPOUSE' })
    // }

    this.relation.push({ relationTypeId: 4, relationType: 'EMPLOYEE.QUOTE.QUOTATION.CHANGE_OPTIONS.ADD_MEMBERS.RELATIONTYPE.DEPENDENT' });
  }

  validateSpouseNewMember(relation) {
    if (this.relationTypeId === 3 && relation === 3) {
      return false;
    } else {
      const countSpouse = this.addedMembers.filter(x => x.relationTypeId === 3);
      return (countSpouse && countSpouse.length > 0 && relation === 3);
    }
    
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


  /**
   * Action to do if ok was pressed. Close modal or Redirect to Url.
   */
  ok() {
    if (!this.memberForm.valid) {
      this.showValidations = true;
      window.setTimeout(() => {
        this.showValidations = false;
      }, this.alertDisappearAlert);
      return;
    }
    if (this.validateSpouseNewMember(this.memberForm.get('relationTypeId').value.relationTypeId)) {
      this.validateSpouse = true;
      this.showValidations = true;
      window.setTimeout(() => {
        this.validateSpouse = false;
        this.showValidations = false;
      }, this.alertDisappearAlert);
      return;
    }
    this.member.memberName = this.memberForm.get('fullname').value;
    this.member.dateOfBirth = new Date(this.memberForm.get('dob').value);
    this.member.age = Utilities.calculateAge(this.memberForm.get('dob').value);
    this.member.relationTypeId = this.memberForm.get('relationTypeId').value.relationTypeId;
    this.member.relationType = this.memberForm.get('relationTypeId').value.relationType;
    this.member.gender = this.memberForm.get('genre').value;
    this.result = this.member;
    this.activeModal.close(true);
  }

  /**
   * Action to do if cancel was pressed. Close modal.
   */
  cancel() {
    this.result = null;
    this.activeModal.close(false);
  }

  getTranslatedRelationTypeMessage(type) {
    let message = '';
    /*this.translate.get(type).subscribe(mes => {
      message = mes;
    });*/

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
    // this.setValidators();
  }

}
