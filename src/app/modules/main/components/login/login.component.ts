import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


import { AuthenticationService, BaseModel, HttpService, MessageServiceCommonKeys, SignInModel, UserModel } from '../../../../core';
import { timeout } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error: string;
    basemodel: BaseModel = new BaseModel();

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private messageService: MessageService,
        private httpService: HttpService,
        private authenticationService: AuthenticationService) {
        this.returnUrl = '';
        // redirect to home if already logged in
        if (this.authenticationService.getCurrentUser) {
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    login() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.messageService.sendMessage(MessageServiceCommonKeys.processing_start);
        // setTimeout(() => {
        //     this.authenticationService.loginTest();
        //     this.router.navigate([this.returnUrl]);
        //     this.messageService.sendMessage(MessageServiceCommonKeys.processing_end);
        // }, 3000);

        let signInModel = new SignInModel();
        Object.assign(signInModel, this.loginForm.value);

        this
            .httpService
            .post<UserModel>(
                environment.api_url + "/Users/SignInUser",
                signInModel,
                this.authenticationService.getCurrentUserTokenHeader())
            .subscribe(
                (res) => {
                    this.basemodel.clear();
                    this.basemodel.append(res);

                    if (!res.hasError) {
                        this.authenticationService.login(res.id, res.username, res.roles, res.token)
                        this.router.navigate([this.returnUrl]);
                        this.messageService.sendMessage('projects-notification', res);
                    }

                    this.loading = false;
                    this.messageService.sendMessage(MessageServiceCommonKeys.processing_end);
                },
                (error) => {
                    this.loading = false;
                    this.messageService.sendMessage(MessageServiceCommonKeys.processing_end);
                    
                    this.basemodel.clear();
                    this.basemodel.errors.push('serverError');
                }
            );

        // this.authenticationService.login(this.f.username.value, this.f.password.value)
        //     .pipe(first())
        //     .subscribe(
        //         data => {
        //             this.router.navigate([this.returnUrl]);
        //         },
        //         error => {
        //             this.alertService.error(error);
        //             this.loading = false;
        //         });
    }
}
