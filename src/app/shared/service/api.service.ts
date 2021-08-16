import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';


const BASE_URL = environment.serverUrl;


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private options = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `${BASE_URL}`
      }
    )
  };
  private fileUploadOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin': `${BASE_URL}`,
        Allow_methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
        Allow_headers: ['Accept', 'Content-Type', 'Authorization']
      }
    )
  };
  constructor(private httpClient: HttpClient) { }

  public get(path: string): Observable<any> {
    return this.httpClient.get(`${BASE_URL}${path}`);
  }

  public getByObjectParam = (path: string, params: any): Observable<any> => this.httpClient.get(`${BASE_URL}${path}`, {params});
  public putByObjectParam = (path: string, params: any): Observable<any> => {
    return this.httpClient.put(`${BASE_URL}${path}`, {params});
  };
  public deleteByObjectParam(path: string, params: any): Observable<any> {
    return this.httpClient.delete(`${BASE_URL}${path}`, {params});
  }

  getFileForDownload(path: string, params: any): Observable<any>  {
    return this.httpClient.get(`${BASE_URL}${path}`, {params});
  }

  public getByParam(path: string, a: string): Observable<any> {
    return this.httpClient.get(`${BASE_URL}${path}/${a}`);
  }


  public getByTwoParam(path: string, param1: string, param2: string): Observable<any> {
    return this.httpClient.get(`${BASE_URL}${path}/${param1}/${param2}`, {});
  }

  public postByParam(path: string, a: string): Observable<any> {
    return this.httpClient.post(`${BASE_URL}${path}/${a}`, {}, this.options).pipe(
      catchError(this.handleError)
    );
  }

  public postByParamAndObject(path: string, a: string, body: object = {}): Observable<any> {
    return this.httpClient.post(`${BASE_URL}${path}/${a}`, JSON.stringify(body), this.options).pipe(
      catchError(this.handleError)
    );
  }


  public post(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .post(`${BASE_URL}${path}`, JSON.stringify(body), this.options)
      .pipe(
        catchError(this.handleError)
      );
  }

  public delete(path: string, id: string) {
    return this.httpClient.delete(`${BASE_URL}${path}/${id}`);
  }

  private log(message: string) {
    // console.log(message);
  }
  handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
  public put(path: string, id: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(`${BASE_URL}${path}/${id}`, JSON.stringify(body), this.options)
      .pipe(
        tap(_ => this.log('updated')),
        catchError(this.handleError)
      );
  }
  public putOnlyObject(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(`${BASE_URL}${path}`, JSON.stringify(body), this.options)
      .pipe(
        tap(_ => this.log('updated')),
        catchError(this.handleError)
      );
  }
  public putLettersObject(path: string, body: object = {}): Observable<any> {
    return this.httpClient
      .put(`${BASE_URL}${path}`, JSON.parse(JSON.stringify(body)))
      .pipe(
        tap(_ => this.log('updated')),
        catchError(this.handleError)
      );
  }

  public putFile(path: string, id: string, body: object = {}): Observable<any> {
    const formData = this.convertJsonToFormData(body);
    return this.httpClient
      .put(`${BASE_URL}${path}/${id}`, formData, this.fileUploadOptions);
  }
  public postFile(path: string, body: object = {}): Observable<any> {
    const formData = this.convertJsonToFormData(body);
    return this.httpClient.post(`${BASE_URL}${path}`, formData, this.fileUploadOptions);
  }
  convertJsonToFormData(jsonObject: any, parentKey: string | null = null, carryFormData: FormData | null = null): FormData {
    const formData = carryFormData || new FormData();
    let index = 0;
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
          let propName = parentKey || key;
          if (parentKey && this.isObject(jsonObject)) {
            propName = parentKey + '[' + key + ']';
          }
          if (parentKey && this.isArray(jsonObject)) {
            propName = parentKey + '[' + index + ']';
          }
          if (jsonObject[key] instanceof File) {
            formData.append(propName, jsonObject[key]);
          } else if (jsonObject[key] instanceof FileList) {
            for (let j = 0; j < jsonObject[key].length; j++) {
              formData.append(propName + '[' + j + ']', jsonObject[key].item(j));
            }
          } else if (this.isArray(jsonObject[key]) || this.isObject(jsonObject[key])) {
            this.convertJsonToFormData(jsonObject[key], propName, formData);
          } else if (typeof jsonObject[key] === 'boolean') {
            formData.append(propName, +jsonObject[key] ? 'true' : 'false');
          } else {
            formData.append(propName, jsonObject[key]);
          }
        }
      }
      index++;
    }
    return formData;
  }
  isArray(val: any) {
    const toString = ({}).toString;
    return toString.call(val) === '[object Array]';
  }
  isObject(val: any) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
  }
}
