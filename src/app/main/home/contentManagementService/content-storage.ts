import { Observable } from 'rxjs/internal/Observable';
import { ContentInformation } from './conten-Information';

export interface ContentStorage {
    loadContentInformationFromStorage(): Observable<ContentInformation []>;

    loadContentInformationFromStorageSecure(): Observable<ContentInformation []>;
}
