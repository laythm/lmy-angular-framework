import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { MessageModel } from '../models/message.model';

@Injectable()
export class MessageService {
    private subject = new Subject<MessageModel>();

    constructor(private router: Router) {

    }

    sendMessage(key: string, message: any = '') {
        this.subject.next({ key: key, data: message });
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Subject<MessageModel> {
        return this.subject;
    }
}
