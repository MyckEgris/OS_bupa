import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'calculateAge'
})
export class CalculateAgePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const fbirth: any = new Date(value);
    const ftoday: any = new Date();

    let a = moment(ftoday);
    let b = moment(fbirth);

    let years = a.diff(b, 'year');
    b.add(years, 'years');

    let months = a.diff(b, 'months');
    b.add(months, 'months');

    let days = a.diff(b, 'days');

    return years;

  }

}
