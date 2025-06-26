import { Component, Input, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Currency } from 'src/app/shared/services/common/entities/currency';

@Component({
  selector: 'app-view-onshore-ach',
  templateUrl: './view-onshore-ach.component.html'
})
export class ViewOnshoreAchComponent implements OnInit {

  @Input() payeeInformation: any;

  public currencies: Currency[] = [];

  public currencyFormat: string;

  constructor(
    private common: CommonService) { }

    async ngOnInit() : Promise<void> {
      this.getCurrency();
    }
  
    async getCurrency(){
      this.currencies = await this.common.getCurrencies().toPromise();
      const currency = this.currencies.find(x => x.currencyId === this.payeeInformation.currencyId);
      this.currencyFormat = `${currency.currencyCode}-${currency.description}`
    }

}
