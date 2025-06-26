import { Injectable } from '@angular/core';
import { ContentType } from './content-type';
import { ContentFactoryService } from './content-factory';
import { Observable } from 'rxjs/internal/Observable';
import { ContentInformation } from './conten-Information';


@Injectable()
export class ContentInformationService {

    public contentInformation: ContentInformation [];

    constructor(private contentFactoryService: ContentFactoryService) { }

    getContentFromStorage(contentType: ContentType):  Observable<ContentInformation []> {
        const contentStorage = this.contentFactoryService.CreateContentStorage(contentType);
        return contentStorage.loadContentInformationFromStorage();
    }

    getContentFromStorageSecure(contentType: ContentType):  Observable<ContentInformation []> {
        const contentStorage = this.contentFactoryService.CreateContentStorage(contentType);
        return contentStorage.loadContentInformationFromStorageSecure();
    }


    loadContentByLanguage(contentType: ContentType, contentLanguage: string) {
        this.getContentFromStorage(contentType).subscribe(
            result => {
              this.contentInformation = result.filter(x => x.language === contentLanguage);
            }
          );
    }

    getContentInformation(): ContentInformation [] {
        return this.contentInformation;
    }

}
