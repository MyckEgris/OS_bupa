/**
* UploadService.ts
*
* @description: This class allows to handle documents by category.
* @author
* @version 1.0
* @date
*
**/


import { Injectable } from '@angular/core';
import { FileUpdaloadDocuments } from './dialog/fileUpdaloadDocuments';
import { loadingStatus } from '../services/common/entities/loadingStatus';
import { FileDocument } from './dialog/fileDocument';
import { HttpClient, HttpParams, HttpRequest, HttpEventType } from '@angular/common/http';
import { UploadResponse } from '../services/common/entities/uploadReponse';
import { ConfigurationService } from '../services/configuration/configuration.service';
import { FilesInterface } from 'src/app/shared/interfaces/filesInterface'

/**
 * This class allows to handle documents by category.
 */
@Injectable()
export class UploadService {

  miArreglo: FilesInterface[] = [];
  /**
   * [HttpGet] Constant for folders endpoint
   */
  private FOLDERS = 'folders';

  /**
   * indicates common api
   */
  private COMMON = 'common';

  /**
   * [HttpGet] Constant for documents endpoint
   */
  private DOCUMENTS = 'documents';

  /**
   * Constant to define how many elements splice in documents array
   */
  private ERASE_ONE_ELEMENT = 1;

  /**
   * Files to be saved that contains documents array
   */
  private filesToBeSaved: FileUpdaloadDocuments = { documents: [] };



  /**
   * Constructor Method
   * @param http Http Client Injection
   * @param config Configuration Service Injection
   */
  constructor(
    private http: HttpClient,
    private config: ConfigurationService
  ) { }



  /**
   * This function allows to remove document file from array.
   * @param document Document file.
   */
  public remove(document: FileDocument) {
    this.filesToBeSaved.documents.splice(this.filesToBeSaved.documents.indexOf(document), this.ERASE_ONE_ELEMENT);
  }

  /**
   * This function allows to remove all document files from array.
   */
  public removeAllDocuments() {
    this.filesToBeSaved.documents = [];
  }

  /**
   * This function allows to remove document file from array filtering by category.
   * @param category Document file category.
   */
  public removeDocumentsByCategory(category: string) {
    const listFiltered = this.filesToBeSaved.documents.filter(x => x.category === category);
    if (listFiltered) {
      listFiltered.forEach(x => {
        this.filesToBeSaved.documents.splice(this.filesToBeSaved.documents.indexOf(x), this.ERASE_ONE_ELEMENT);
      });
    }
  }

  /**
   * This function allows to gets all the document files from array.
   */
  public getDocuments() {
    return this.filesToBeSaved.documents;
  }

  /**
   * This function allows to gets all the document files from array filtering by category.
   * @param category Document file category.
   */
  public getDocumentsByCategory(category: string) {
    return this.filesToBeSaved.documents.filter(x => x.category === category);
  }

  /**
   * This function allows to add one document file to array.
   * @param file Document file.
   * @param category Document file category.
   */
  public addDocument(file: File, category: string) {
    this.filesToBeSaved.documents.push(
      {
        loadingStatus: loadingStatus.New,
        progress: 0,
        file: file,
        icon: this.getFileIcon(file),
        category: category
      });
  }

  public addFilesIndex(index: number, name: string, typeAttachment: string, file: File) {
    this.miArreglo.push(
      {
        index,
        name,
        typeAttachment,
        file
      }
    )
  }

  public getAllFilesIndex(): FilesInterface[] {
    return this.miArreglo;
  }

  public getSearchFile(): FilesInterface[] {
    return this.miArreglo;
  }

  searchFile(name: string, index: number): boolean {
    return this.miArreglo.some(p => p.name === name && p.index === index);
  }

  searchFileXml(index: number): boolean {
    return this.miArreglo.some(p => p.typeAttachment === "CLAIM_BILL" && p.index === index && p.name.endsWith('.xml'));
  }

  searchFileMedical(index: number): boolean {
    return this.miArreglo.some(p => p.typeAttachment === "MEDICAL_RECORDS" && p.index === index);

  }

  public deleteFilesIndex(index: number, name: string, typeAttachment: string) {
    const indice = this.miArreglo.findIndex(
      elemento => elemento.index === index && elemento.name === name && elemento.typeAttachment === typeAttachment
    );

    if (indice !== -1) {
      this.miArreglo.splice(indice, 1);
    }
  }

  public deleteFilesAllIndex(index: number, typeAttachment: string) {
    for (let i = this.miArreglo.length - 1; i >= 0; i--) {
      if (this.miArreglo[i].index === index && this.miArreglo[i].typeAttachment === typeAttachment) {
        this.miArreglo.splice(i, 1);
      }
    }
  }

  deleteAllFilesIndex(index: number) {

    let itemSearch = this.miArreglo.filter(item => item.index === index);
    itemSearch.forEach(item => {
      const indexToRemove = this.filesToBeSaved.documents.findIndex(doc => doc.file === item.file);

      if (indexToRemove !== -1) {
        this.filesToBeSaved.documents.splice(indexToRemove, this.ERASE_ONE_ELEMENT);
        this.miArreglo.splice(indexToRemove, 1);
      }
      else {

      }
    });

    this.miArreglo.forEach((item, i) => {
      if (item.index > index) {
        item.index--;
      }
    });
    // for (let i = 0; i < this.miArreglo.length; i++) {
    //   if (i >= index) {
    //     this.miArreglo[i].index = i;
    //   }
    // }

  }


  /**
   * This function allows to show a representative icon for a specify document.
   * @param file Document file.
   */
  private getFileIcon(file: File): string {
    const bupaFiles = 'image:.jpeg,.jpg,.gif,.png,.bmp|pdf:.pdf|code:.xml|word:.doc,.docx';
    const ext = '.' + file.name.toLowerCase().split('.').slice(-1)[0];
    const type = bupaFiles.toLowerCase()
      .split('|').filter(p => p.indexOf(ext) >= 0)[0]
      .split(':')[0];
    return `fa-file-${type}-o`;
  }

  /**
   * This function allows to upload document file to repository.
   * @param url Url repository.
   * @param document Document file to upload.
   */
  uploadFile(url: string, document: FileDocument): Promise<UploadResponse> {
    return new Promise<UploadResponse>((resolve, rej) => {
      const formData = new FormData();
      formData.append('upload', document.file, document.file.name);
      const params = new HttpParams();
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

  /**
   * Upload first document file to folder.
   * @param document Document file selected.
   */
  public uploadFirstDocument(document: FileDocument): Promise<UploadResponse> {
    return this.uploadFile(`${this.config.apiHostCommon}/${this.COMMON}/${this.DOCUMENTS}`, document);
  }

  /**
   * Upload document file to folder.
   * @param file Document file selected to upload.
   * @param folder Folder that contain the selected document file.
   */
  public uploadDocumentToFolder(file: FileDocument, folder: string): Promise<UploadResponse> {
    return this.uploadFile(`${this.config.apiHostCommon}/${this.COMMON}/${this.FOLDERS}/${folder}/${this.DOCUMENTS}`, file);
  }

  public removeAllFiles(){
    this.miArreglo = [];
  }

}
