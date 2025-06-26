import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Genders } from '../services/common/entities/genders';
/**
 *Author: Enrique Durango
 *Date Creation: 20200925
 * @export
 * @class TranslateObservableListGenderPipe
 * @implements {PipeTransform}
 */
@Pipe({
  name: 'translateObservableListGender'
})
export class TranslateObservableListGenderPipe implements PipeTransform {
  private GENDER_ID_UNKNOW = 1;
  /**
   * Translate gender's list
   */
  constructor(private translate: TranslateService) { }
  async transform(value: Observable<Genders[]>, args?: any): Promise<any> {
    const genders: Array<Genders> = [];
    await value.toPromise().then(x => {
      x.forEach(async t => {
        if (t.genderId !== this.GENDER_ID_UNKNOW) {
          const nameTranslated  = await this.translate.get(`POLICY.POLICY_ENROLLMENT.STEP2.GENRE.${t.name.toLocaleUpperCase()}`)
            .toPromise();
          genders.push({
            genderId: t.genderId,
            name: nameTranslated
          });
        }
      });

    });
   return genders;
 }

}
