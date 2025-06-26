import { Injectable } from '@angular/core';
import { ContentType } from './content-type';
import { ContentStorage } from './content-storage';
import { HttpClient } from '@angular/common/http';
import { DefaultContentStorage } from './default-content-storage';


@Injectable()
export class ContentFactoryService {

    constructor(private _http: HttpClient) { }

    CreateContentStorage(contentType: ContentType): ContentStorage {
        switch (contentType) {
            case ContentType.InMemoryStorage:
                return new DefaultContentStorage(this._http);
            default:
                return new DefaultContentStorage(this._http);
        }
    }

}
