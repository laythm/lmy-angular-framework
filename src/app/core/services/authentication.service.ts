import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from './message.service';
import { RolesEnum, UserModel } from '../models/user.model';
import { MessageServiceCommonKeys } from '../models/messageService-common-keys';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUser: UserModel;

    constructor(private http: HttpClient,
        private messageService: MessageService) {

        if (localStorage.getItem('currentUser') != null) {
            this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        }
    }

    public get getCurrentUser(): UserModel {
        return this.currentUser;
    }

    public getCurrentUserHasRole(roleName: RolesEnum): boolean {
        if (this.currentUser != null) {
            if (this.currentUser.roles.some(r => r == roleName)) {
                return true;
            }
        }

        return false;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        this.messageService.sendMessage(MessageServiceCommonKeys.userLoggedOut);
    }

    login(userid, username, roles, token) {
        this.currentUser = new UserModel();
        this.currentUser.id = userid;
        this.currentUser.username = username;
        this.currentUser.roles = roles;
        this.currentUser.token = token;
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.messageService.sendMessage(MessageServiceCommonKeys.userLoggedIn);
    }

    getCurrentUserTokenHeader(): { key: string, value: string } {

        if (this.currentUser != null) {
            return { key: "authorization", value: "Bearer " + this.currentUser.token };
        }

        return null;
    }
}
