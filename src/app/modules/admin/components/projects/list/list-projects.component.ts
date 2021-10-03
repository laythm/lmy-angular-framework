import { ThisReceiver } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, asNativeElements, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService, BaseModel, ConfirmComponent, fadeInAnimation, HttpService, ListModel, MessageService, PagingSortingModel, SortInfo, TableHeaderColumns, TableHeaderComponent } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';
import { ProjectModel, ProjectSearchModel } from '../../../models/project.model';

@Component({
  selector: 'list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.scss'],
})

export class ListProjectsComponent implements OnInit, OnDestroy {
  @ViewChild('pager') pager: PaginatorComponent;
  @ViewChild('header') header: TableHeaderComponent;
  loading: boolean;
  frm: FormGroup;
  messageSubscription: Subscription;
  basemodel: BaseModel = new BaseModel();

  items: ProjectModel[];
  tblColumns: TableHeaderColumns;
  totalItemsCount: number = 0;
  pagingSortingModel = new PagingSortingModel<ProjectSearchModel>(1, 10);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private httpService: HttpService,
    private authenticationService: AuthenticationService) {

    this.messageSubscription = this.messageService.getMessage().subscribe(m => {
      if (m.key == 'projects-notification') {
        this.basemodel.append(m.data);

        this.clear();
      }
    });

    this.frm = this.formBuilder.group({
      title: [],
      description: []
    });

    this.setTableColumns();
  }

  setTableColumns() {
    this.tblColumns = new TableHeaderColumns([
      { name: 'title', sortable: true, displayName: 'admin.title' },
      { name: 'description', sortable: true, displayName: 'admin.description' },
      { name: 'actions', sortable: false, displayName: 'actions' }]);
  }

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.setTableData();
  }

  onSortChange(sortInfo) {
    this.pagingSortingModel.page = 1;
    this.pagingSortingModel.sortInfo = sortInfo;
    this.setTableData();
  }

  onChangePage(page) {
    this.pagingSortingModel.page = page;
    this.setTableData();
  }

  get f() { return this.frm.controls; }

  clear() {
    this.frm.reset();

    this.pagingSortingModel.data = null;
    this.pagingSortingModel.page = 1;
    this.pagingSortingModel.sortInfo = null;

    this.setTableData();
  }

  search() {
    this.pagingSortingModel.data = new ProjectSearchModel();

    Object.assign(this.pagingSortingModel.data, this.frm.value);

    this.pagingSortingModel.page = 1;
    this.pagingSortingModel.sortInfo = null;

    this.setTableData();
  }

  setTableData() {
    this.totalItemsCount = 0;
    this.items = [];
    this.loading = true;

    this
      .httpService
      .post<ListModel<ProjectModel>>(
        environment.api_url + "/projects/search",
        this.pagingSortingModel,
        this.authenticationService.getCurrentUserTokenHeader())
      .subscribe(
        (res) => {
          this.loading = false;

          this.basemodel.append(res);

          if (!res.hasError) {
            this.totalItemsCount = res.totalRecordsCount;
            this.items = res.list;
          }
        },
        (error) => {
          this.loading = false;
          this.items = [];

          this.basemodel.errors.push('serverError');
        }
      );

  }
}
