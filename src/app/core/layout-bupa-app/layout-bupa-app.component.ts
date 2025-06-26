import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RequestLoadingService } from 'src/app/shared/services/request-loading/request-loading.service';

@Component({
  selector: 'app-layout-bupa-app',
  templateUrl: './layout-bupa-app.component.html',
  styleUrls: ['./layout-bupa-app.component.css']

})
export class LayoutBupaAppComponent implements OnInit {

  /**
   * Loading flag
   */
    public loading: boolean;


  anio: string = new Date().getFullYear() + ' ';

  /**
   * Code for the external links
   */
  public code = 'ES';



  constructor(
    private requestLoading: RequestLoadingService,

  ) { }

  ngOnInit() {
    try {
      this.requestLoading.subscribe(p => this.loading = p);
    } catch (error) {
    }
  }
}
