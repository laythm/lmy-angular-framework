import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FasDirective } from 'angular-bootstrap-md';
import { AuthenticationService, BaseModel, fadeInAnimation, HttpService, MessageService, PasswordValidator, slideInOutAnimation, UserModel } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';
import { UserLookupsModel } from '../../../models/users-lookups.model';

@Component({
  selector: 'add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class AddUserComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean;
  loading: boolean;
  basemodel: BaseModel = new BaseModel();
  userLookupsModel: UserLookupsModel = new UserLookupsModel();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private httpService: HttpService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      userName: [null, Validators.required],
      password: [null, [Validators.required, PasswordValidator.password, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      roles: [null, Validators.required]
    });

    this.loadData();
  }

  get f() { return this.frm.controls; }

  loadData() {
    this.loading = true;

    this
      .httpService
      .get<UserLookupsModel>(
        environment.api_url + "/users/GetLookups",
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res) => {
          this.basemodel.append(res);

          if (!res.hasError) {
            this.userLookupsModel = res;
            this.loading = false;
          }
        },
        (error) => {
          this.basemodel.errors.push('serverError');
        }
      );
  }

  close() {
    this.router.navigate(['/admin/users'], {});
  }

  save() {
    this.submitted = true;

    if (this.frm.invalid) {
      return;
    }

    this.loading = true;

    let user = new UserModel();
    Object.assign(user, this.frm.value);
    this
      .httpService
      .post<BaseModel>(
        environment.api_url + "/users/add",
        user,
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res) => {
          this.basemodel = res;
          if (!res.hasError) {
            this.close();
            this.messageService.sendMessage('users-notification', res);
          }

          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.basemodel.errors.push('serverError');
        }
      );
  }
}
