import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Error404Component } from './errors/error404/error404.component';
import { SharedModule } from '../shared/shared.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Error401Component } from './errors/error401/error401.component';
import { UnderConstructionComponent } from './under-construction/under-construction.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutBupaAppComponent } from './layout-bupa-app/layout-bupa-app.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatProgressBarModule,
    SharedModule,
    NgbModule
  ],
  declarations: [MenuComponent, HeaderComponent, FooterComponent, LayoutComponent, Error404Component, Error401Component,
    UnderConstructionComponent,
    LayoutBupaAppComponent],
  exports: [MenuComponent, HeaderComponent, FooterComponent, LayoutComponent, Error404Component, Error401Component,
    UnderConstructionComponent]
})
export class CoreModule { }
