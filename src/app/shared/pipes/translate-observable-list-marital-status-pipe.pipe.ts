import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { MaritalStatus } from '../services/common/entities/marital-status';
/**
 *Author: Enrique Durango
 *Date Creation : 20200925
 * @export
 * @class TranslateObservableListMaritalStatusPipePipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'translateObservableListMaritalStatusPipe'
})
export class TranslateObservableListMaritalStatusPipePipe implements PipeTransform {
  private MARITAL_STATUS_ID_UNKNOW = 5;
  constructor(private translate: TranslateService) { }
  async transform(value: Observable<MaritalStatus[]>, args?: any): Promise<any> {
    const maritalStatuses: Array<MaritalStatus> = [];
    await value.toPromise().then(x => {
      x.forEach(async t => {
        if (t.maritalStatusId !== this.MARITAL_STATUS_ID_UNKNOW) {
          const nameTranslated  = await this.translate
            .get(`POLICY.POLICY_ENROLLMENT.MARITAL_STATUS.${t.name.toLocaleUpperCase()}`).toPromise();
          maritalStatuses.push({
            maritalStatusId: t.maritalStatusId,
            name: nameTranslated
          });
        }
      });

    });
   return maritalStatuses;
 }

}
