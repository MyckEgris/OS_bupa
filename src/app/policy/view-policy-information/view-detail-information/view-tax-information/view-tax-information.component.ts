import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Instance } from 'src/app/shared/services/policy/entities/Instance';
import { TaxCertificateDataResponse } from 'src/app/shared/services/policy/entities/TaxCertificateDataResponse';
import { TaxResponse } from 'src/app/shared/services/policy/entities/TaxResponse';
import { cfdiResponse } from 'src/app/shared/services/policy/entities/cfdiIResponse';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-view-tax-information',
  templateUrl: './view-tax-information.component.html',
  styleUrls: ['./view-tax-information.component.css']
})
export class ViewTaxInformationComponent implements OnInit {

  @Input() policyId: string;
  @Input() agentId: number;
  @Input() policyCountry: string;
  @Input() ownerDob: string;
  @Input() insuranceBusinessId: number;
  @ViewChild('inputFile') inputFile: ElementRef;
  forma: FormGroup;           

  private statusInvalid: number = 400;
  private invalidIssueDate: number = 401;
  private propCfdiId: string = 'cfdiId';
  private propRegimenId: string = 'regimenId';

  private instance: Instance<TaxResponse>;

  regimes: TaxResponse[];  
  cfdiList: cfdiResponse[];   

  public disableregimens: boolean;
  public disableCfdis: boolean;
  public hideLegalEntity: boolean;
  public clickRegimes: boolean;
  public clickCFDI: boolean;
  private file: File = null;

  constructor(
    private policyService: PolicyService,
    private notification: NotificationService,
    private fb: FormBuilder    
  ) { 
    this.disableregimens = true;
    this.disableCfdis = true;
    this.hideLegalEntity = false;
    this.clickRegimes = true;
    this.clickCFDI = true;

    this.forma = this.fb.group({
      regimenId:[''],
      cfdiId:[''],
      individualData: this.fb.group({
        firstName: [''],        
        lastName: [''],
        maternalName: ['']        
      }),
      companyName: [''],
      commercialSociety: [''],
      cp: [''],
      address: [''],
      street: [''],
      interior: [''],
      exterior: [''],
      rfc: [''],
      policyid: [''],
      isCompany:[false],
      town: [''],
      federalEntity: [''],
      municipality: [''],
      documentInformation: this.fb.group({
        agentId: [''],
        policyCountry: [''],
        ownerDob: [''],
        insuranceBusinessId: ['']
      })
    });
  }  

  ngOnInit() {    
    this.policyService.getCFDIAndRegimes()
      .subscribe(x => {        
        this.instance = x;                
      });      
  }

  updateData() {
    let formObj = this.forma.getRawValue();    

    this.policyService.updateTaxData(formObj)
    .subscribe(x => {
      if (x == 1) {
        this.policyService.saveDocument(formObj, this.file)
        .subscribe(x => {
          if(x.success && x.element) {
            this.notification.showDialog('POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.UPDATED_DATA', 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.UPDATED_DATA_AT_BUPA');
          } else {            
            this.notification.showDialog(`Error: (${x.errorCode})`, 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.ERROR_SAVING_RECORD');
          }
        });
      }
      if (x == 0) {
        this.notification.showDialog('POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.ERROR_UPDATING_DATA', 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.WITHOUT_TAX_EVIDENCE');        
      }

      if (x == 5) {
        this.notification.showDialog('POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.ERROR_UPDATING_DATA', 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.THERE_IS_NO_ZIP_CODE');        
      }
      
      if (x == 4) {
        this.notification.showDialog('POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.ERROR_UPDATING_DATA', 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.YOU_CANNOT_CHANGE_THE_TYPE_OF_PERSON');
      }

      this.reset();
    });        
  }

  reset() {
    this.cfdiList = null;
    this.regimes = null;
    this.disableregimens = true;
    this.disableCfdis = true;
    this.hideLegalEntity = false;
    this.clickRegimes = true;
    this.clickCFDI = true;
    this.file = null;
    this.forma.reset();
    this.forma.patchValue({
      cfdiId:  '',
      regimenId: ''
    });
  }

  executeClickInputFile() {    
    this.inputFile.nativeElement.click();    
  }

  sendFile(event) {        
    const pdfFiles = event.target.files;
    const pdfFile = pdfFiles.item(0);            

    if (pdfFile.type === 'application/pdf') {
      this.reset();
      this.file = event.target.files[0];
      const formdata: FormData = new FormData();      
      formdata.append('pdfFile', pdfFile); 
      this.policyService.processPDF(formdata)
        .subscribe(x => {
          if(x.errorCode == this.statusInvalid || x.errorCode == this.invalidIssueDate) {
            this.notification.showDialog('POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.ERROR_UPDATING_DATA', x.errorCode == this.statusInvalid 
                ? 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.INCORRECT_CSF_STATUS' 
                : 'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.POLICY_MORE_THAN_ONE_MONTH');
          } else if (x.success == false && x.errorCode != this.statusInvalid && x.errorCode != this.invalidIssueDate) {            
            this.notification.showDialog(
              'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.INVALID_PDF', 
              'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.THERE_IS_NO_ZIP_CODE'
            );
          } else {
            if(x.element.isCompany) {
              this.hideLegalEntity = true;              
              this.regimes = this.instance.elementList.filter(x => x.isCompany);              
            } else {
              this.hideLegalEntity = false;              
              this.regimes = this.instance.elementList.filter(x => x.isIndividual);              
            }            
            this.cfdiList = this.regimes[0].cfdis;
            this.setForm(x.element);
            this.disableregimens = false;            
          }
          event.target.value = "";
        });
    } else {      
      this.notification.showDialog(
        'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.INVALID_PDF', 
        'POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.MESSAGES.PDF_ERROR_DESCRIPTION'
      );
      event.target.value = "";
    }    
  }
  
  setCfdis(regimenTypeId: number) {    
    this.disableCfdis = false;    
    this.cfdiList = this.regimes.find(x => x.regimenTypeId == regimenTypeId).cfdis;
    this.forma.patchValue({
      cfdiId:  ''      
    });
    this.clickCFDI = true;
  }

  setEnableSaveButton() {    
    this.clickCFDI = false;
  }

  setForm(user: TaxCertificateDataResponse) {
    
    
    this.forma.setValue({
      cfdiId: this.forma.get(this.propCfdiId).value,
      regimenId: this.forma.get(this.propRegimenId).value,
      individualData: {
        firstName: user.firstName,
        lastName: user.paternalLastName,
        maternalName: user.maternalLastName,        
      },    
      companyName: user.companyName,    
      commercialSociety: user.commercialSociety,        
      cp: user.zipCode,
      address: user.addressLine,
      street: user.street,      
      interior: user.interior,
      exterior: user.exterior,
      rfc: user.rfc,
      policyid: this.policyId,
      isCompany: user.isCompany,
      town: user.town,
      federalEntity: user.federalEntity,
      municipality: user.municipality,
      documentInformation: {
        agentId: this.agentId,
        policyCountry: this.policyCountry,
        ownerDob: this.ownerDob,
        insuranceBusinessId: this.insuranceBusinessId
      }
    });
    let formObj = this.forma.getRawValue();
    console.log(formObj);
  }  
}
