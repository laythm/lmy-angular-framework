import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable } from "@angular/core";
import { EmptyError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ErrorModel } from "../models/error.model";
import { AuthenticationService } from "./authentication.service";
import { ErrorHelper } from "./error.helper";
import { HttpService } from "./http.service";

@Injectable()
export class ErrorHandlerService implements ErrorHandler {
    constructor(private httpService: HttpService) {

    }

    handleError(error: any) {
        this.httpService.logError(error);
    }
}