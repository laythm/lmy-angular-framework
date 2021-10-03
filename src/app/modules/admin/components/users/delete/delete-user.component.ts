import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, BaseModel, ConfirmComponent, fadeInAnimation, HttpService, MessageService, slideInOutAnimation } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class DeleteUserComponent implements OnInit {
  id: string;
  loading: boolean;
  basemodel: BaseModel = new BaseModel();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private httpService: HttpService,
    private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  close() {
    this.router.navigate(['/admin/users'], {});
  }

  confirm() {
    this.loading = true;

    this
      .httpService
      .get<BaseModel>(
        environment.api_url + "/users/delete?id=" + this.id,
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res: BaseModel) => {
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
