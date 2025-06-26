import { Injectable } from '@angular/core';
import { ContentInformation } from '../home/contentManagementService/conten-Information';

@Injectable({
  providedIn: 'root'
})
export class InfographicsService {

  content: ContentInformation;

  constructor() { }

  newContent(contentP: ContentInformation) {
    this.content = contentP;
  }

  removeContent() {
    this.content = null;
  }
}
