/*import { Component } from '@angular/core';
@Component
({
selector: 'app-claim-report',
template: `<p>Hello world!</p>`
})
export class ClaimReportComponent{}*/



import { HttpParams } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ClaimService } from 'src/app/shared/services/claim/claim.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { Router,ActivatedRoute } from '@angular/router';
import { UserInformationReducer } from '../../security/reducers/user-information.reducer';



import { MenuModel } from '../../security/model/menu.model';

import { TranslationService } from '../../shared/services/translation/translation.service';
import { AuthService } from '../../security/services/auth/auth.service';
import { OptionState } from '../../security/model/option-state';
import { MenuOptionService } from '../../security/services/menu-option/menu-option.service';
import { Location } from '@angular/common';
import { RedirectService } from '../../shared/services/redirect/redirect.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';




@Component({
  selector: 'app-claim-report',
  templateUrl: './claim-report.component.html',
  styleUrls: ['./claim-report-container.component.css']

})
export class ClaimReportComponent implements OnInit {
  public name: string;
  public currentUserId: string;
  public isAnonymous: Boolean = false;
  public roleId: string;

  constructor(private claimService: ClaimService,
   
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private location: Location,
    private translation: TranslationService,
    private authService: AuthService,
    private userInfoStore: Store<UserInformationReducer.UserInformationState>,
    private menuOption: MenuOptionService,
    private _redirectService: RedirectService,
    private notification: NotificationService,
    private translate: TranslateService
    ) { }


  public claimViewForm: FormGroup;
  private PDF_APPLICATION_RESPONSE = 'application/pdf';
  private XLS_APPLICATION_RESPONSE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  private CSV_APPLICATION_RESPONSE = 'text/csv';




  ngOnInit() {
    
    this.claimViewForm = new FormGroup({
      firstName: new FormControl(),
      dateOfServiceFrom: new FormControl(),
    });

    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.name = userInfo.given_name;
      this.name += userInfo.family_name === 'NA'? '' : ' ' + userInfo.family_name;
      this.currentUserId = userInfo.user_key;
      if (userInfo.user_key_alternative) {
        this.currentUserId = this.currentUserId + ' | ' + userInfo.user_key_alternative;
      }
      this.roleId = userInfo.role_id;
      if (userInfo.is_anonymous) {
        this.isAnonymous = userInfo.is_anonymous;
      } else {
        this.isAnonymous = false;
      }
    });


  }


  

  getReport() {
  
    this.userInfoStore.pipe(select('userInformation')).subscribe(userInfo => {
      this.name = userInfo.given_name;
      this.name += userInfo.family_name === 'NA'? '' : ' ' + userInfo.family_name;
      this.currentUserId = userInfo.user_key;
      if (userInfo.user_key_alternative) {
        this.currentUserId = this.currentUserId + ' | ' + userInfo.user_key_alternative;
      }
      this.roleId = userInfo.role_id;
      if (userInfo.is_anonymous) {
        this.isAnonymous = userInfo.is_anonymous;
      } else {
        this.isAnonymous = false;
      }
    });
   
    let fechaIn = this.claimViewForm.value.dateOfServiceFrom.dateFrom;
    let fechaFn = this.claimViewForm.value.dateOfServiceFrom.dateTo;
    let formato = 3;
    this.claimService.getReport(formato.toString(),fechaIn,fechaFn,this.name,this.currentUserId).subscribe(claimService => {
      var data = JSON.parse(claimService);
      const file = base64ToBlob(data.contentbytes,this.XLS_APPLICATION_RESPONSE);
    
      const fileName = `report-${Utilities.generateRandomId()}`;
      saveAs(file, fileName + '.' + 'xls');
     
    }, error => {
    });


  }

  
}

function base64ToBlob(b64Data,fileType, sliceSize=512) {

  let byteCharacters = window.atob(b64Data); 
  let byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
  
      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, {type: fileType});
  }

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}




