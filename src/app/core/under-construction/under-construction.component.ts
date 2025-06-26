import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html'
})
export class UnderConstructionComponent implements OnInit {

  constructor(
    private router: Router,
    private configuration: ConfigurationService
  ) { }

  ngOnInit() {
  }

  goToHome() {
    location.href = this.configuration.returnUrl;
    // this.router.navigateByUrl(this.configuration.returnUrl);
  }

}
