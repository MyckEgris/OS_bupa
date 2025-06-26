/**
* PolicyHolderProfileViewComponent.ts
*
* @description: This component shows the proper information for policy holders and allow them to edit it
* @author Andres Tamayo
* @version 1.0
* @date 06-06-2019.
*
**/
import { Component, OnInit } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UpdatePolicyRequestDto } from 'src/app/shared/services/policy/entities/updatePolicyRequest.dto';
import { DatePipe } from '@angular/common';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';

@Component({
  selector: 'app-policy-holder-profile-view',
  templateUrl: './policy-holder-profile-view.component.html'
})
export class PolicyHolderProfileViewComponent implements OnInit {

  policy: PolicyDto;
  policyInfo: PolicyDto;
  /**
   * Date pipe instance for customization
   */
  public pipe: DatePipe;

  /**
   * Current language
   */
  public language: string;

  public SPANISH_LOADED = 'SPA';

  /**
   * COnstant for Locate for Spanish
   */
  private SPA_LOCATE = 'es-Us';

  /**
   * Constant for Locale for English
   */
  private ENG_LOCATE = 'en-Us';

  /**
   * Language suscription.
   */
  private languageSubcripcion;

  /**
   * Spanish date format.
   */
  private SPA_DATE_FORMAT = `dd 'd'e MMMM 'd'e yyyy`;

  /**
   * English date format.
   */
  private ENG_DATE_FORMAT = 'MMMM dd, yyyy';

  /**
   * Spanish date format.
   */
  private DATE_FORMAT = '';

  /**
   * Default Date format.
   */
  private MONTH_FORMAT = 'MM';

  /**
   * Constant for day format
   */
  private DAY_FORMAT = 'dd';

  public childUrl = '';

  /**
   * Policy Holder Profile component's constructor.
   * @param userInfoStore inyect store reducre information
   * @param _route ActivatedRoute
   */
  constructor(
    private _route: ActivatedRoute,
    private _policyService: PolicyService,
    private translate: TranslateService,
    private translationService: TranslationService,
    private router: Router,
    private notification: NotificationService
    ) {
      this.policy = this._route.snapshot.data['policyInfo'].policyInfo;
    }

  /**
   * loads policy holders informations and the initical form
   */
  ngOnInit() {
    this.language = this.translationService.getLanguage();
    this.setDateTimeFormatByLocation();

    this.languageSubcripcion = this.translate.onLangChange.subscribe( res => {
        this.language = res.lang;
        this.setDateTimeFormatByLocation();
    });
  }

  /**
   * Formats date and time based on the current language.
   */
  private setDateTimeFormatByLocation() {

    if (this.language === this.SPANISH_LOADED) {
      this.pipe = new DatePipe(this.SPA_LOCATE);
      this.DATE_FORMAT = this.SPA_DATE_FORMAT;
    } else {
      this.pipe = new DatePipe(this.ENG_LOCATE);
      this.DATE_FORMAT = this.ENG_DATE_FORMAT;
    }
  }
  /**
   * Updates changes.
   */
  updatePolicy(policyDto: UpdatePolicyRequestDto) {

    this._policyService.updatePolicy(policyDto, 'ChangeContactInformation')
    .subscribe( async result => {
      await this.showSucessfullMessage(policyDto);
    },
      err => {
        this.showErrorMessage(err);
      }
    );
  }

  /**
   * Shows sucessfull message.
   */
  private async showSucessfullMessage(policyDto: UpdatePolicyRequestDto) {
    let message = '';
   // const dateFormat = this.pipe.transform(policyDto.changeMetadata.effectiveDate, this.DATE_FORMAT);
    message = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.GENERAL_INFORMATION.SECOND_SUCESS_MESSAGE').toPromise();
   // message = `${message}${dateFormat}`;
    const messageTitle = await this.translate.get('AGENT.PROFILE.OK_MESSAGE_TITLE').toPromise();
    const notification = await this.notification.showDialog(messageTitle, message);
    if (notification) {
      this.router.navigate(['/' + this.childUrl]);
    }
  }

  /**
   * validates current date agains policy effective's date.
   * @param policyDto Update Policy Request.
   */
  private ValidateIfEffectiveDateIsEqualsToDateNow(policyDto: UpdatePolicyRequestDto) {
    const currentDate = Date.now();
    const currentMonth = this.pipe.transform(currentDate, this.MONTH_FORMAT);
    const currentDay = this.pipe.transform(currentDate, this.DAY_FORMAT);
    const effectiveDateMonth = this.pipe.transform(policyDto.changeMetadata.effectiveDate, this.MONTH_FORMAT);
    const effectiveDateDay = this.pipe.transform(policyDto.changeMetadata.effectiveDate, this.DAY_FORMAT);

    if ((Number(currentMonth) === Number(effectiveDateMonth)) && (Number(currentDay) === Number(effectiveDateDay))) {
      return true;
    }
    return false;
  }

  /**
   * Shows error message.
   * @param errorMessage Shows Error messages.
   */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    if (errorMessage.error.code) {
      this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
        result => message = result
      );
      this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
        result => messageTitle = result
      );
      this.notification.showDialog(messageTitle, message);
    }
  }
}
