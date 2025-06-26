
/**
* HideIfRoleDirective.ts
*
* @description: Custom directive for hide elements according authenticated role
* @author Juan Camilo Moreno.
* @version 1.0
* @date 05-02-2019.
*
**/

import { Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core/';
import { AuthService } from './../../security/services/auth/auth.service';
import { Directive } from '@angular/core';

/**
 * Custom directive for hide elements according authenticated role
 */
@Directive({
  selector: '[appHideIfRole]'
})
export class HideIfRoleDirective implements OnInit {

  /**
   * Is Visible
   */
  public isNotVisible: boolean;

  /**
   *
   * @param templateRef Template Ref
   * @param viewContainer View Container
   * @param authService AuthService Injection
   */
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) { }

  /**
   * Input appShowIfRole
   */
  @Input() set appHideIfRole(restrictedRoles: string) {
    const userRole = this.authService.getUser().role;
    this.isNotVisible = (restrictedRoles.indexOf(userRole) > -1);
  }

  /**
   * Analize if the element can be visible for the role and show or hide
   */
  ngOnInit() {
    if (this.isNotVisible) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

}
