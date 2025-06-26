import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RoutingStateService } from 'src/app/shared/services/routing/routing-state.service';
import { MyPortfolioService } from 'src/app/security/services/my-portfolio/my-portfolio.service';

@Injectable()
export class PortfolioResolver implements Resolve<any> {

  constructor(private router: Router,
    private portfolioService: MyPortfolioService,
    private routingState: RoutingStateService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };

    if (!this.isPageLoadingItself()) {
      this.portfolioService.setMyPortfolioStore(undefined);
    }
    return true;
  }

  isPageLoadingItself() {
    const route = this.routingState.getPreviousUrlRouteResolver().indexOf('agents/view-portfolio');
    return (route > -1);
  }
}
