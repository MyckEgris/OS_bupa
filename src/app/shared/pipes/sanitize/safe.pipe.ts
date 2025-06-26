/**
* SafePipe.ts
*
* @description: Transforms html elements to sanitize code to prevent XSS attacks
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';

/**
 *  Transform html elements with sanitize code to prevent XSS attacks
 */
@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {

  /**
   * Constructor Method
   * @param sanitizer DomSanitizer
   */
  constructor(protected sanitizer: DomSanitizer) { }

  /**
   * Implementation of transform function of PipeTransform
   * @param value Value
   * @param type Type of element for sanitization
   */
  public transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
