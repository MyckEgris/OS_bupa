import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-question-tax-information',
  templateUrl: './question-tax-information.component.html',
  styleUrls: ['./question-tax-information.component.css']
})
export class QuestionTaxInformationComponent implements OnInit {

  @Input() id: string;
  @Input() ask: string;
  @Input() answer: string;
  


  constructor(private sanitizer: DomSanitizer) {     
    this.sanitizer.bypassSecurityTrustHtml(this.answer);    
  }

  ngOnInit() {    
    console.log(this.answer);
  }

}
