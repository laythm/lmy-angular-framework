import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FasDirective } from 'angular-bootstrap-md';
import { AuthenticationService, BaseModel, fadeInAnimation, HttpService, MessageService, slideInOutAnimation } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';
import { ProjectModel } from '../../../models/project.model';

@Component({
  selector: 'add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class AddProjectComponent implements OnInit {
  frm: FormGroup;
  submitted: boolean;
  loading: boolean;
  basemodel: BaseModel = new BaseModel();

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private httpService: HttpService,
    private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      title: [null, Validators.required],
      description: [null, Validators.required]
    });
  }
  
  get f() { return this.frm.controls; }

  close() {
    this.router.navigate(['/admin/projects'], {});
  }

  save() {
    this.submitted = true;

    if (this.frm.invalid) {
      return;
    }

    this.loading = true;

    let project = new ProjectModel();
    Object.assign(project, this.frm.value);
    this
      .httpService
      .post<BaseModel>(
        environment.api_url + "/projects/add",
        project,
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res) => {
          this.basemodel = res;
          if (!res.hasError) {
            this.close();
            this.messageService.sendMessage('projects-notification', res);
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
