import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Identification } from 'src/app/shared/services/common/entities/Identification';

@Injectable({
  providedIn: 'root'
})
export class ManageIdentificationTypesService {

  private identificationsTypesTranslated: Array<Identification> = [];
  private registrationCertificateId = 113;
  private identityCardYouthId = 120;
  constructor(
    private translate: TranslateService,
    private commonService: CommonService
    ) { }

    /**
     * Gets identifications by business from common API
     * @param businessId
     */
    async getIdentificationsByBusiness(businessId: number) {
      return await this.commonService.getIdentifications(businessId).toPromise();
    }

    /**
     * Gets identifications by business holder (for Step 2)
     * @returns  this.identificationsTypes
     */
  async getIdentificationsByBusinessHolder(businessId: number) {
    if (this.identificationsTypesTranslated.length > 0) {
      return this.identificationsTypesTranslated.filter(x => x.identificationTypeId !== this.registrationCertificateId
        && x.identificationTypeId !== this.identityCardYouthId);
    } else {
      const identificationsTypes: Array<Identification> =  await this.getIdentificationsByBusiness(businessId);
      for (let index = 0; index < identificationsTypes.length; index++) {
        const ident = identificationsTypes[index];
        const keyTranslate = `POLICY.POLICY_ENROLLMENT.IDENTIFICATION_TYPES.${ident.typeName}`;
        const typeNameTranslated  = await this.translate.get(keyTranslate).toPromise();
          this.identificationsTypesTranslated.push({
          identificationTypeId: ident.identificationTypeId,
          typeName: typeNameTranslated,
          insuranceBusinessId: ident.insuranceBusinessId
        });
      }
      return this.identificationsTypesTranslated.filter(x => x.identificationTypeId !== this.registrationCertificateId
        && x.identificationTypeId !== this.identityCardYouthId);
    }
  }


  /**
   * Gets identifications by business dependent
   * @returns  this.identificationsTypes;
   */
  async getAllIdentifications(businessId: number) {
    if (this.identificationsTypesTranslated.length > 0) {
      return this.identificationsTypesTranslated;
    } else {
      const identificationsTypes: Array<Identification> =  await this.getIdentificationsByBusiness(businessId);
      for (let index = 0; index < identificationsTypes.length; index++) {
        const ident = identificationsTypes[index];
        const keyTranslate = `POLICY.POLICY_ENROLLMENT.IDENTIFICATION_TYPES.${ident.typeName}`;
        const typeNameTranslated  = await this.translate.get(keyTranslate).toPromise();
        this.identificationsTypesTranslated.push({
          identificationTypeId: ident.identificationTypeId,
          typeName: typeNameTranslated,
          insuranceBusinessId: ident.insuranceBusinessId
        });
      }
      return this.identificationsTypesTranslated;
    }
  }
}
