import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, BaseModel, fadeInAnimation, HttpService, MessageService, slideInOutAnimation } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';
import { ProjectModel } from '../../../models/project.model';

@Component({
  selector: 'edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})

export class EditProjectComponent implements OnInit {
  id: string;
  frm: FormGroup;
  submitted: boolean;
  loading: boolean;
  basemodel: BaseModel = new BaseModel();

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
      title: [null, Validators.required],
      description: [null, Validators.required]
    });

    this.loadData();
  }

  get f() { return this.frm.controls; }

  loadData() {
    this.loading = true;

    this
      .httpService
      .get<ProjectModel>(
        environment.api_url + "/projects/get?id=" + this.id,
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

    project.id = this.id;

    this
      .httpService
      .post<BaseModel>(
        environment.api_url + "/projects/edit",
        project,
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res) => {
          this.basemodel.append(res);
          if (!res.hasError) {
            this.messageService.sendMessage('projects-notification', res);
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