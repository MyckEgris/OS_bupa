/**
* UploadService.ts
*
* @description: Service for upload files to any server
* @author Yefry Lopez.
* @version 1.0
* @date 17-09-2018.
*
**/

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { UploadResponse } from '../common/entities/uploadReponse';
import { FileDocument } from '../common/entities/fileDocument';
import { loadingStatus } from '../common/entities/loadingStatus';

/**
 * Service for upload files to any server
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService {

  /**
   * Constructor Method
   * @param http HttpClient Injection
   */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Upload file to server
   * @param url Server Url
   * @param document FileDocument
   */
  uploadFile(url: string, document: FileDocument, paramsP?: HttpParams): Promise<UploadResponse> {
    return new Promise<UploadResponse>((resolve, rej) => {
      const formData = new FormData();
      formData.append('upload', document.file, document.file.name);
      let params = new HttpParams();
      if (paramsP) {
        params = paramsP;
      }
      const options = {
        params: params,
        reportProgress: true
      };
      const request = new HttpRequest('POST', url, formData, options);
      this.http.request(request).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          document.loadingStatus = loadingStatus.Loading;
          document.progress = Math.round(event.loaded / event.total * 100);
        }
        if (event.type === HttpEventType.Response) {
          document.loadingStatus = loadingStatus.Loaded;
          resolve(event.body as UploadResponse);
        }
      },
        error => {
          document.loadingStatus = loadingStatus.Error;
          rej(error);
        });
    });
  }
}
