import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-buttons',
  templateUrl: './navigation-buttons.component.html'
})
export class NavigationButtonsComponent implements OnInit {

  @Input() next: string;
  @Input() back: string;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  nextPage() {
    this.router.navigate([this.next]);
  }

  previousPage() {
    this.router.navigate([this.back]);
  }

}
