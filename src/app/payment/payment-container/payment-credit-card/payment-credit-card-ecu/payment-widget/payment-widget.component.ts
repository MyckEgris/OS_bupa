import { Component, OnInit, AfterViewInit, Inject, ElementRef, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as $ from 'jquery';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-payment-widget',
  templateUrl: './payment-widget.component.html'
})
export class PaymentWidgetComponent implements OnInit, AfterViewInit {

  @Input() returnUrl: string;
  @Input() payurl: string;
  @Input() creditCardTypes: string;

  loadAPI: Promise<any>;

  constructor(
    @Inject(DOCUMENT) private document) { }

  ngOnInit() {
    this.loadAPI = new Promise((resolve) => {
      this.loadConfigurationOptions();
    });
    this.addWidgetForm();
  }

  ngAfterViewInit(): void {
    this.addWidgetScript();
    Utilities.delay(2000).then(() => this.addVerifiedImage());
  }

  addWidgetScript() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    s.src = this.payurl;
    document.getElementsByTagName('head')[0].appendChild(s);
  }

  addWidgetForm() {
    const container = document.getElementById('form-container');
    const form = document.createElement('form');
    form.setAttribute('action', this.returnUrl);
    form.setAttribute('class', 'paymentWidgets');
    form.setAttribute('data-brands', this.creditCardTypes);

    container.appendChild(form);
  }

  addVerifiedImage() {
    const verifiedButton = '<br/><br/><img src=' + '"https://www.datafast.com.ec/images/verified.png" style=' + '"display:block;margin:0 auto; width:100%;">';
    $('form.wpwl-form-card').find('.wpwl-button').before(verifiedButton);
  }

  loadConfigurationOptions() {
    const script = this.document.createElement('script');
    script.type = 'text/javascript';
    script.src = './assets/js/datafast.js';
    script.async = true;
    script.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  changeLangOnWidget() {
    const s = this.document.createElement('script');
    s.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(s);
  }

}
