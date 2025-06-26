/**
* AgreementService.component.ts
*
* @description: This class manages the agreements for site.
* @author Yefry Lopez.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 01-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../security/services/auth/auth.service';

import { ConfigurationService } from '../../../shared/services/configuration/configuration.service';
import { UUID } from 'angular2-uuid';
import { Utilities } from '../../../shared/util/utilities';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgreementUserVersionsDto } from './models/agreement-user-version.dto';
import { Agreement } from './models/agreement.model';
import { AgreementUserDto } from './models/agreement-user.dto';
import { AgreementRefusedModel } from './models/agreement-refused.model';
import { AgreementDto } from './models/agreement.dto';
import { AgreementUser } from './models/agreement-user.model';
import { AgreementsComponent } from './agreements/agreements.component';

/**
 * This class manages the agreements for site.
 */
@Injectable({
  providedIn: 'root'
})
export class AgreementService {
  /**
   * [HttpGet] Constant for agreements by role endpoint
   */
  private AGREEMENTS_BY_ROLE = 'agreements';

  /**
   * [HttpGet] Constant for user agreements by id endpoint.
   */
  private AGREEMENTS_USER_BY_ID = 'users/{0}/Agreements';

  /**
   * [HttpPatch] Constant for update agreements endpoint
   */
  private AGREEMENTS_TO_UPDATE = 'users/{0}/Agreements';

  /**
   * Constant for define default language
   */
  private DEFAULT_LANGUAGE = 'SPA';

  /**
   * Array for refused agreements to show user
   */
  private _refuseAgreements = [];

  /**
   * Define if agreements review finish
   */
  public isAgreement = false;

  /**
   * Getter for refused agreements access
   */
  public getRefusedAgreements() {
    return this._refuseAgreements;
  }

  /**
   * Setter for refused agreements access
   * @param refusedAgreement refusedAgreement
   */
  public setRefusedAgreements(refusedAgreement) {
    this._refuseAgreements.push(refusedAgreement);
  }

  /**
   * Constructor
   * @param _http HttpClient injection
   * @param _config Configuration Service injection
   * @param modalService Modal Service injection
   * @param _authService Auth Service injection
   */
  constructor(
    private _http: HttpClient,
    private _config: ConfigurationService,
    private modalService: NgbModal,
    private _authService: AuthService) { }

  /**
   * Get agreements by role or roles
   * @param roles Array or roles
   * @param lang Language
   */
  async getAgreementsByRole(roles: Array<string>, lang: string) {

    return await this._http.get(`${this._config.apiHost}/${this.AGREEMENTS_BY_ROLE}?roles=${roles.join(',')}&lang=${lang}`)
      .toPromise()
      .then((response: Response) => response)
      .catch(this.handleError);
  }

  /**
   * Get agreements by user
   * @param user User
   */
  async getUserAgreementById(user: string) {
    return await this._http.get(`${this._config.apiHost}/${this.AGREEMENTS_USER_BY_ID.replace('{0}', user)}`)
      .toPromise()
      .then((response: Response) => response)
      .catch(this.handleError);
  }

  /**
   * Mapper for add agreement dto to agreement version dto
   * @param agreementByUserDto DTO for agreements by user
   * @param agreement Agreement object
   */
  addUserAgreementVersionsDto(agreementByUserDto: AgreementUserVersionsDto, agreement: Agreement): AgreementUserVersionsDto {
    if (agreementByUserDto) {
      return agreementByUserDto;
    } else {
      const agreementUserVersionsDto: AgreementUserVersionsDto = {
        agreementId: agreement.agreementId,
        agreementVersionId: agreement.agreementVersionId,
        isAccepted: false,
        refuseNumber: 0,
        dateAccepted: null,
        createDate: null,
        retryCount: agreement.retryCount,
        canUserBeLocked: agreement.canUserBeLocked,
        ipClient: ''
      };

      return agreementUserVersionsDto;
    }
  }

  /**
   * Mapper for build DTO agreement by user
   * @param agreementByUserDto DTO for agreement by user
   * @param agreement Agreement object
   * @param user User
   * @param name Name of user
   */
  addUserAgreementDto(agreementByUserDto: AgreementUserVersionsDto, agreement: Agreement, user: string, name: string): AgreementUserDto {
    const agreementsByUserDto: Array<AgreementUserVersionsDto> = [];
    if (agreementByUserDto) {
      agreementsByUserDto.push(agreementByUserDto);
    } else {
      agreementsByUserDto.push(this.addUserAgreementVersionsDto(agreementByUserDto, agreement));
    }
    return {
      id: user,
      name: name,
      userAgreementVersionsDto: agreementsByUserDto
    };
  }

  /**
   * Mapper for build Refused agreements
   * @param agreement Agreement object
   * @param agreementByUserDto DTO agreement by user
   * @param user User
   * @param name Name of user
   */
  addAgreementRefusedModel(agreement: Agreement, agreementByUserDto: AgreementUserVersionsDto,
    user: string, name: string): AgreementRefusedModel {
    if (agreementByUserDto) {
      return {
        agreementId: agreement.agreementId,
        isAccepted: agreementByUserDto.isAccepted,
        refuseNumber: agreementByUserDto.refuseNumber,
        language: agreement.agreementLanguage,
        agreementName: agreement.agreementUrl,
        retryCount: agreement.retryCount,
        canUserBeLocked: agreement.canUserBeLocked,
        hideButtonLastRetry: agreement.hideButtonLastRetry,
        title: agreement.title,
        agreementUserDto: this.addUserAgreementDto(agreementByUserDto, agreement, user, name)
      };
    } else {
      return {
        agreementId: agreement.agreementId,
        isAccepted: false,
        refuseNumber: 0,
        language: agreement.agreementLanguage,
        agreementName: agreement.agreementUrl,
        retryCount: agreement.retryCount,
        canUserBeLocked: agreement.canUserBeLocked,
        hideButtonLastRetry: agreement.hideButtonLastRetry,
        title: agreement.title,
        agreementUserDto: this.addUserAgreementDto(agreementByUserDto, agreement, user, name)
      };
    }
  }

  /**
   * Show an array with all agreements without has been accepted
   * @param agreements DTO agreement
   * @param agreementsByUser Agreement user object
   * @param user User
   * @param name Name of user
   */
  async getAgreementsWithoutAccept(agreements: AgreementDto, agreementsByUser: AgreementUser, user: string, name: string) {
    const refusedAgreements: Array<AgreementRefusedModel> = [];
    try {
      if (agreements) {
        agreements.aggrementsDto.forEach(agreement => {
          if (agreementsByUser.id !== null) {
            let existsAgreement = false;
            agreementsByUser.userAgreementVersionsDto.forEach(agreementByUser => {
              if (agreement.agreementId === agreementByUser.agreementId &&
                agreement.agreementVersionId === agreementByUser.agreementVersionId) {
                existsAgreement = true;
                if (!agreementByUser.isAccepted || agreementByUser.dateAccepted == null) {
                  refusedAgreements.push(this.addAgreementRefusedModel(agreement,
                    agreementByUser, agreementsByUser.id, agreementsByUser.name));
                }
              }
            });
            if (!existsAgreement) {
              refusedAgreements.push(this.addAgreementRefusedModel(agreement, null, user, name));
            }
          } else {
            refusedAgreements.push(this.addAgreementRefusedModel(agreement, null, user, name));
          }
        });
      }
      return await refusedAgreements;
    } catch (error) {
    }
  }

  /**
   * Get agreement content in Html format
   * @param path Path agreement content are located
   */
  async getHtmlAgreement(path: string) {
    return await this._http.get(path, { responseType: 'text' }).toPromise();
  }

  /**
   * Update agreement state (Accept or Refuse)
   * @param agreement Refused agreement object
   */
  async updateAgreement(agreement: AgreementRefusedModel) {
    return await this._http.patch(`${this._config.apiHost}/${this.AGREEMENTS_TO_UPDATE.replace('{0}',
      agreement.agreementUserDto.id)}`, agreement.agreementUserDto)
      .toPromise()
      .then((response: Response) => response)
      .catch(this.handleError);
    // .subscribe((response: Response) => response, error => error);
  }

  /**
   * Compare agreements by role against agreements by user, match and return refused or non accepted agreements
   * @param userId User
   * @param roles Array of roles
   * @param userName Username
   * @param lang Language
   */
  async getAgreementsToAccept(userId: string, roles: Array<any>, userName: string, lang: string) {
    const agreements: any = await this.getAgreementsByRole(roles, lang);
    const agreementsByUser: any = await this.getUserAgreementById(userId);
    const refusedAgreements = await this.getAgreementsWithoutAccept(agreements, agreementsByUser, userId, userName);
    return refusedAgreements;
  }

  /**
   * Loop refused agreements object and show in modal popup
   * @param userId User
   * @param roles Array of roles
   * @param userName Username
   * @param lang Language
   */
  async showAgreements(userId: string, roles: Array<any>, userName: string, lang: string) {
    const agreements: any = await this.getAgreementsByRole(roles, lang);
    const agreementsByUser: any = await this.getUserAgreementById(userId);
    const refusedAgreements = await this.getAgreementsWithoutAccept(agreements, agreementsByUser, userId, userName);

    for (const agreement of refusedAgreements) {
      const data = await this.getHtmlAgreement(`./assets${agreement.agreementName}`);
      this.showAgreementsDialog(agreement, data, false);
    }
  }

  /**
   * Capture response from modal agreement window, map fields to send to api and request agreement api
   * @param updatedAgreement Agreement update object
   * @param isConfirmed Boolean confirm
   */
  proccessAgreementToUpdate(updatedAgreement: any, isConfirmed: boolean) {
    const dateNow = Utilities.getDateNow();
    updatedAgreement.isAccepted = isConfirmed;
    updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].isAccepted = isConfirmed;
    updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].canUserBeLocked = updatedAgreement.canUserBeLocked;
    updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].retryCount = updatedAgreement.retryCount;
    if (isConfirmed) {
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].dateAccepted = dateNow;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].refuseNumber = 0;
      updatedAgreement = this.updateAgreement(updatedAgreement);

    } else {
      updatedAgreement.refuseNumber = updatedAgreement.refuseNumber + 1;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].refuseNumber = updatedAgreement.agreementUserDto
        .userAgreementVersionsDto[0].refuseNumber + 1;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].dateRefused = dateNow;
      updatedAgreement = this.updateAgreement(updatedAgreement);
      this._authService.logoff();
    }
  }

  /**
   * Handle error
   * @param error Error
   */
  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }

  /**
   * Execute agreements proccess from request
   */
  async startAgreements() {
    const user = this._authService.getUser();
    if (!user.is_anonymous) {
      const agreements = await this.getAgreementsToAccept(user.sub, user.roles, user.name,
        user.language ? user.language : this.DEFAULT_LANGUAGE);

      if (agreements.length === 0) {
        this.isAgreement = true;
        return new Promise(resolve => {
          resolve(false);
        });
        // return;
      }

      if (agreements) {
        let contAgreement = 0;
        let lastAgreement = false;
        for (const agreement of agreements) {

          const data = await this.getHtmlAgreement(`./assets${agreement.agreementName}`);
          if (contAgreement === agreements.length - 1) {
            lastAgreement = true;
          }
          await this.showAgreementsDialog(agreement, data, lastAgreement);
          contAgreement++;
        }

        return new Promise(resolve => {
          resolve(true);
        });
      }
    }
  }

  /**
   * Open modal agreement popup
   */
  async showAgreementsDialog(agreement, htmlContent, lastAgreement: boolean) {

    await Utilities.delay(1000);
    const result = this.modalService.open(AgreementsComponent,
       { size: 'lg', centered: true, backdrop: 'static', keyboard: false, windowClass: 'ig-modalagreement'});
    const dialog = result.componentInstance;
    dialog.title = agreement.title;
    dialog.content = htmlContent;
    dialog.acceptText = 'APP.BUTTON.AGREE_BTN';
    dialog.declineText = 'APP.BUTTON.DECLINE_BTN';
    dialog.idContent = UUID.UUID();
    dialog.canUserBeLocked = agreement.canUserBeLocked;
    dialog.hideButtonLastRetry = agreement.hideButtonLastRetry;
    dialog.retryCount = agreement.retryCount;
    dialog.refuseNumber = agreement.refuseNumber;
    dialog.agreementId = agreement.agreementId;
    const isConfirmed = await result.result;
    const updateAgreement = Object.assign({}, agreement);
    this.updateAgreementValue(updateAgreement, isConfirmed, lastAgreement);
  }

  /**
   * Open modal agreement popup with dynamically component
   * @param htmlContent Content in Html format
   * @param title Title
   */
  showCustomAgreementsDialog(htmlContent, title: string) {
    const result = this.modalService.open(AgreementsComponent, { size: 'lg', centered: true, backdrop: 'static', keyboard: false });
    const dialog = result.componentInstance;
    dialog.title = title;
    dialog.content = htmlContent;
    dialog.acceptText = 'APP.BUTTON.AGREE_BTN';
    dialog.declineText = 'APP.BUTTON.DECLINE_BTN';
    return result.result;
  }

  /**
   * Map agreement for update object and request agreement api
   * @param updatedAgreement Agreement update object
   * @param isConfirmed Confirm response
   * @param lastAgreement Last agreement
   */
  async updateAgreementValue(updatedAgreement: any, isConfirmed: boolean, lastAgreement: boolean) {
    try {
      updatedAgreement.isAccepted = isConfirmed;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].isAccepted = isConfirmed;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].canUserBeLocked = updatedAgreement.canUserBeLocked;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].retryCount = updatedAgreement.retryCount;
      updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].createDate = Utilities.getDateNow();
      if (isConfirmed) {
        updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].dateAccepted = new Date();
        updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].refuseNumber = 0;
        updatedAgreement = await this.updateAgreement(updatedAgreement);
        if (lastAgreement) {
          this.isAgreement = true;
        }
      } else {
        updatedAgreement.refuseNumber = updatedAgreement.refuseNumber + 1;
        updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].refuseNumber = updatedAgreement.agreementUserDto
          .userAgreementVersionsDto[0].refuseNumber + 1;
        updatedAgreement.agreementUserDto.userAgreementVersionsDto[0].dateRefused = Utilities.getDateNow();
        updatedAgreement = this.updateAgreement(updatedAgreement);
        this._authService.logoff();
      }
    } catch (error) {
    }
  }
}
