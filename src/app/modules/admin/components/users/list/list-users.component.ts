import { ThisReceiver } from '@angular/compiler';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AfterViewInit, asNativeElements, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService, BaseModel, ConfirmComponent, fadeInAnimation, HttpService, ListModel, MessageService, PagingSortingModel, SortInfo, TableHeaderColumns, TableHeaderComponent, UserModel } from 'src/app/core';
import { PaginatorComponent } from 'src/app/core/components/paginator/paginator.component';
import { environment } from 'src/environments/environment';
import { UserSearchModel } from '../../../models/user-search.model';
import { UserLookupsModel } from '../../../models/users-lookups.model';

@Component({
  selector: 'list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss'],
})

export class ListUsersComponent implements OnInit, OnDestroy {
  @ViewChild('pager') pager: PaginatorComponent;
  @ViewChild('header') header: TableHeaderComponent;
  loading: boolean;
  frm: FormGroup;
  messageSubscription: Subscription;
  basemodel: BaseModel = new BaseModel();

  items: UserModel[];
  tblColumns: TableHeaderColumns;
  totalItemsCount: number = 0;
  pagingSortingModel = new PagingSortingModel<UserSearchModel>(1, 10);
  userLookupsModel = new UserLookupsModel();

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private httpService: HttpService,
    private authenticationService: AuthenticationService) {

    this.messageSubscription = this.messageService.getMessage().subscribe(m => {
      if (m.key == 'users-notification') {
        this.basemodel.append(m.data);

        this.clear();
      }
    });

    this.frm = this.formBuilder.group({
      firstName: [],
      lastName: [],
      userName: [],
      email: [],
      roles: []
    });

    this.setTableColumns();
    this.loadData();
  }

  setTableColumns() {
    this.tblColumns = new TableHeaderColumns([
      { name: 'firstName', sortable: true, displayName: 'admin.firstName' },
      { name: 'lastName', sortable: true, displayName: 'admin.lastName' },
      { name: 'userName', sortable: true, displayName: 'admin.userName' },
      { name: 'email', sortable: true, displayName: 'admin.email' },
      { name: 'roles', sortable: false, displayName: 'admin.roles' },
      { name: 'actions', sortable: false, displayName: 'actions' }]);
  }

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
          //this.loading = false;
        },
        (error) => {
          //this.loading = false;
          this.basemodel.errors.push('serverError');
        }
      );
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
    this.pagingSortingModel.data = new UserSearchModel();

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
      .post<ListModel<UserModel>>(
        environment.api_url + "/users/search",
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
