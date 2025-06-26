/**
* ShowIfRoleDirective.ts
*
* @description: Custom directive for show elements according authenticated role
* @author Juan Camilo Moreno.
* @version 1.0
* @date 29-01-2019.
*
**/

import { Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core/';
import { AuthService } from './../../security/services/auth/auth.service';
import { Directive } from '@angular/core';

/**
 * Custom directive for show elements according authenticated role
 */
@Directive({
  selector: '[appShowIfBusinessInsurance]'
})
export class ShowIfBusinessInsuranceDirective implements OnInit {

  /**
   * Is Visible
   */
  public isVisible: boolean;

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
  @Input() set appShowIfBusinessInsurance(businessInsurance: string) {
    const userBusinessInsurance = this.authService.getUser().bupa_insurance;
    this.isVisible = (businessInsurance.indexOf(userBusinessInsurance) > -1);
  }

  /**
   * Analize if the element can be visible for the role and show or hide
   */
  ngOnInit() {
    if (this.isVisible) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
