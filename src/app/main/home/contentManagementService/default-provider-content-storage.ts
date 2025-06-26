import { ContentStorage } from './content-storage';
import { HttpClient } from '@angular/common/http';
import { ContentInformation } from './conten-Information';
import { Observable } from 'rxjs/internal/Observable';

export class DefaultContentProviderStorage implements ContentStorage {

    private contentInformationUrl = 'assets/cms/content-provider-information.json';

    constructor(private _http: HttpClient) { }

    loadContentInformationFromStorage(): Observable<ContentInformation []> {
        return this._http.get<ContentInformation[]>(this.contentInformationUrl);
    }

    loadContentInformationFromStorageSecure(): Observable<ContentInformation[]> {
        throw new Error('"Method not implemented."');
    }
}
