import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowResizeService {

  constructor() {

    window.addEventListener('resize', (e) => {
      this.onResize.next();
    });

  }

  public onResize = new Subject();
}
