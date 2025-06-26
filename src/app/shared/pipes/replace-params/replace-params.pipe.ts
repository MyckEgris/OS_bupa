import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceParams'
})
export class ReplaceParamsPipe implements PipeTransform {
  transform(value1: string, value2: string, value3: string): any {
    const aux = `\\{${value2}\\}`
    const regex = new RegExp(aux,'gmi');
    const result = value1.replace(regex, value3);
    return result;
  }

}
