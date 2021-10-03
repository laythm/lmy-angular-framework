import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, BaseModel, fadeInAnimation, HttpService, MessageService, PasswordValidator, slideInOutAnimation, UserModel } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';
import { UserLookupsModel } from '../../../models/users-lookups.model';

@Component({
  selector: 'edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class EditUserComponent implements OnInit {
  id: string;
  frm: FormGroup;
  submitted: boolean;
  loading: boolean;
  basemodel: BaseModel = new BaseModel();
  userLookupsModel: UserLookupsModel = new UserLookupsModel();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private httpService: HttpService,
    private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.frm = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      userName: [null, Validators.required],
      password: [null, [PasswordValidator.password,Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      roles: [null, Validators.required]
    });

    this.loadData();
  }

  get f() { return this.frm.controls; }

  loadData(loadSeq: number = 0) {
    this.loading = true;
    if (loadSeq == 0) {
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

              this.loadData(loadSeq + 1);
            }
          },
          (error) => {
            this.basemodel.errors.push('serverError');
          }
        );
    }

    if (loadSeq == 1) {
      this
        .httpService
        .get<UserModel>(
          environment.api_url + "/users/get?id=" + this.id,
          this.authenticationService.getCurrentUserTokenHeader())
        .subscribe(
          (res) => {
            this.basemodel.append(res);

            if (!res.hasError) {
              this.frm.patchValue(res);
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

    user.id = this.id;

    this
      .httpService
      .post<BaseModel>(
        environment.api_url + "/users/edit",
        user,
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res) => {
          this.basemodel.append(res);
          if (!res.hasError) {
            this.messageService.sendMessage('users-notification', res);
            this.close();
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