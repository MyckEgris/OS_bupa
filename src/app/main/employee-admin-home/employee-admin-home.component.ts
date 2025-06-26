import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-admin-home',
  templateUrl: './employee-admin-home.component.html'
})
export class EmployeeAdminHomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.navigate(['users/impersonation']);
  }

}
