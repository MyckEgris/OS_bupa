import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'receivedMethod'
})

export class ReceivedMethodPipe implements PipeTransform {

  mail : number = 3;
  email : number = 4;
  online : number = 5;
  transfer : number = 6;
  years_24 : number = 7;
  transform(value: any, args?: any): any {
    switch(value){
      case this.mail:
        return "POLICY.RECEIVED_METHODS.MAIL";
      case this.email:
        return "POLICY.RECEIVED_METHODS.EMAIL";
      case this.online:
        return "POLICY.RECEIVED_METHODS.ONLINE";
      case this.transfer:
        return "POLICY.RECEIVED_METHODS.TRANSFER";
      case this.years_24:
        return "POLICY.RECEIVED_METHODS.24_YEARS";
      default:
        return "POLICY.RECEIVED_METHODS.OTHERS";
    }
  }

}
