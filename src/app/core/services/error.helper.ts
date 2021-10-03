import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";

export class ErrorHelper {
    static getStringError(error: any): string {
        let errorMessage = '';

        if (error && error.stack) {
            errorMessage = error.stack;
        }

        if (error instanceof HttpErrorResponse) {
            if (error.error instanceof ErrorEvent) {
                // client-side error
                errorMessage = (`http Error: ${error.error.message}`);
            } else {
                // server-side error
                errorMessage = (`http Error Code: ${error.status}\nMessage: ${error.message}`);
            }
        }

        return errorMessage;
    }

    static getBrowserName() {
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
            case agent.indexOf('edge') > -1:
                return 'edge';
            case agent.indexOf('opr') > -1 && !!(<any>window).opr:
                return 'opera';
            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
                return 'chrome';
            case agent.indexOf('trident') > -1:
                return 'ie';
            case agent.indexOf('firefox') > -1:
                return 'firefox';
            case agent.indexOf('safari') > -1:
                return 'safari';
            default:
                return 'other';
        }
    }

}