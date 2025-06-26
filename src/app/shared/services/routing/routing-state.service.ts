/**
* RoutingStateService.ts
*
* @description: Service for handles routing history
* @author Juan Camilo Moreno.
* @version 1.0
* @date 08-05-2019.
*
**/

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Service for handles routing history
 */
@Injectable()
export class RoutingStateService {
    private history = [];

    /**
     * Constructor method
     * @param router Router injection
     */
    constructor(
        private router: Router
    ) { }

    /**
     * Load routing history
     */
    public loadRouting(): void {
      debugger;
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(({ urlAfterRedirects }: NavigationEnd) => {
                this.history = [...this.history, urlAfterRedirects];
            });
    }

    /**
     * Get all history
     */
    public getHistory(): string[] {
        return this.history;
    }

    /**
     * Get previous url
     */
    public getPreviousUrl(): string {
        return this.history[this.history.length - 2] || '/index';
    }

    /**
     * Get previous url for Route Resolvers
     */
    public getPreviousUrlRouteResolver(): string {
        return this.history[this.history.length - 1] || '/index';
    }
}
