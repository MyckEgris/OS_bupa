import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-faq-tax-information',
  templateUrl: './faq-tax-information.component.html',
  styleUrls: ['./faq-tax-information.component.css']
})
export class FaqTaxInformationComponent implements OnInit {

  public questions = [
    {
      id: "collapseone",
      ask: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.Q1",
      answer: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.A1"
    },
    {
      id: "collapsetwo",
      ask: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.Q2",
      answer: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.A2"
    },
    {
      id: "collapsethree",
      ask: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.Q3",
      answer: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.A3"
    },
    {
      id: "collapsefour",
      ask: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.Q4",
      answer: "POLICY.VIEW_POLICY_DETAILS.TAX_INFORMATION.FAQS.A4"
    }
  ];

  constructor() {     
  }

  ngOnInit() {    
  }

  toggle(event: MouseEvent) {
    event.preventDefault();    
    $("#ig-soporte-ayuda").toggleClass("ig-toggled animated fadeIn");
    $("#menu-toggle").toggleClass("toggled1");
  }
}
