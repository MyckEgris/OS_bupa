/**
* ShowPasswordDirective.ts
*
* @description: Custom directive to show password on input type='password' controls
* @author Arturo Suarez.
* @version 1.0
* @date 11-10-2018.
*
**/

import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { OAuthInfoEvent } from 'angular-oauth2-oidc';

@Directive({
  selector: '[appShowPassword]'
})
export class ShowPasswordDirective {

  constructor(
    private el: ElementRef,
    private control: NgControl) {
    this.setup();
  }

  isPass = true;

  setup() {
    this.el.nativeElement.setAttribute('type', 'password');
    const parent = this.el.nativeElement.parentNode;
    const newParentDiv = document.createElement('div');
    newParentDiv.className = 'input-group';
    parent.replaceChild(newParentDiv, this.el.nativeElement);
    newParentDiv.appendChild(this.el.nativeElement);
    const eyeIcon = document.createElement('div');
    eyeIcon.className = 'input-group-append';
    eyeIcon.innerHTML = '<span class="input-group-text"><i class="material-icons"> remove_red_eye </i></span>';
    eyeIcon.addEventListener('click', (event) => { this.toggleType(); });
    newParentDiv.appendChild(eyeIcon);
  }

  @HostListener('input', ['$event']) onEvent($event) {
  }

  toggleType() {
    if (this.isPass) {
      this.el.nativeElement.setAttribute('type', 'text');
    } else {
      this.el.nativeElement.setAttribute('type', 'password');
    }
    this.isPass = !this.isPass;
  }

}
