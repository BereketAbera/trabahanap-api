 import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'
import { throwError} from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Picture } from '../model/picture';
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { environment } from '../../environments/environment';

import * as moment_ from 'moment';
const moment = moment_;

const uploadApi = environment.APIEndpoint +  "glry";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public countSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) { }
  createImage(picture: Picture, filesList: File[]) {
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', "multipart/form-data");
    let params = new HttpParams();
    const formData: FormData = new FormData();
    for (let i = 0; i < filesList.length; i++) {
      formData.append('fileArray', filesList[i], filesList[i].name);
    }
    formData.append('name', picture.name);
    return this.http.post(uploadApi, formData, { params, headers }).pipe(
      catchError(this.handleError)
    );
  }
  removeImage(pictureId:number|String){
    return this.http.delete(uploadApi +"/" + pictureId).pipe(
      map(
        picture => { 
          return <Picture>picture;
        }
      ),
      catchError(this.handleError)
    )
  }
  listImages():  Observable<Picture[]> {
    return this.http.get(uploadApi).pipe(
      map(
        res => { 
          this.countSubject.next(res['count']);
          return res['rows'];
        }
      ),
      catchError(this.handleError)
    )
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };

}

A
A
A
A
A
A
A
A
A
A
A
A
A
A

