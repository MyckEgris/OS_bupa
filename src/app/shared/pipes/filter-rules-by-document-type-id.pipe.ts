import { Pipe, PipeTransform } from '@angular/core';
import { RuleByBusiness } from '../services/common/entities/rule-by-business';

@Pipe({
  name: 'filterRulesByDocumentTypeId'
})
export class FilterRulesBydocumentTypeIdPipe implements PipeTransform {

  transform(items: Array<RuleByBusiness>, documentTypeId: number): Array<RuleByBusiness> {
    return items.filter(id => id.documentTypeId === documentTypeId);
  }
}
