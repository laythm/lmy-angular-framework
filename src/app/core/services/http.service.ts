import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ErrorModel } from '../models/error.model';
import { AuthenticationService } from './authentication.service';
import { ErrorHelper } from './error.helper';


@Injectable()
export class HttpService {

    constructor(private http: HttpClient,
        private authenticationService: AuthenticationService) {

    }

    get<T>(url: string, token?: { key: string, value: string }, bypassErrorCatch = false): Observable<any> {

        let headers: HttpHeaders;

        if (token) {
            headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Access-Control-Allow-Headers", "Content-Type")
                .set(token.key, token.value);
        } else {
            headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set("Accept", "application/json")
                .set("Access-Control-Allow-Headers", "Content-Type");
        }

        if (bypassErrorCatch) {
            return this.http.get<T>(url, { headers }).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 401) {
                        this.authenticationService.logout();
                    }
                    return throwError(error);
                }));
        } else {
            return this.http.get<T>(url, { headers }).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 401) {
                        this.authenticationService.logout();
                    } else {
                        this.logError(error);
                    }
                    
                    return throwError(error);
                }));
        }
    }

    post<T>(url: string, data: any, token?: { key: string, value: string }, bypassErrorCatch = false) {
        let headers: HttpHeaders;

        if (token) {
            headers = new HttpHeaders()
                .set("Content-Type", "application/json")
                .set(token.key, token.value);
        } else {
            headers = new HttpHeaders()
                .set("Content-Type", "application/json");
        }

        if (bypassErrorCatch) {
            return this.http.post<T>(url, data, { headers })
                .pipe(
                    catchError((error: HttpErrorResponse) => {
                        if (error.status == 401) {
                            this.authenticationService.logout();
                        }

                        return throwError(error);
                    }));
        } else {
            return this.http.post<T>(url, data, { headers }).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status == 401) {
                        this.authenticationService.logout();
                    } else {
                        this.logError(error);
                    }
                    return throwError(error);
                }));
        }
    }

    logError(error: any) {
        let errorModel = new ErrorModel();
        errorModel.browser = ErrorHelper.getBrowserName();
        errorModel.error = ErrorHelper.getStringError(error);
        errorModel.userID = this.authenticationService.getCurrentUser ? this.authenticationService.getCurrentUser.id : null;

        this.post(environment.api_url + "/common/LogClientError", errorModel, null, true)
            .pipe(catchError(error => of([])))//to not raise error 
            .subscribe();
    }
}
