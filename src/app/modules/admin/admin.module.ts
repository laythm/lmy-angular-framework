import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './';
import { ListProjectsComponent } from './';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'src/app/core/services/auth.guard';
import { RolesEnum } from 'src/app/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'src/app/core';
import { AddProjectComponent } from './components/projects/add/add-project.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule } from '@ngx-translate/core';
import { EditProjectComponent } from './components/projects/edit/edit-project.component';
import { DeleteProjectComponent } from './components/projects/delete/delete-project.component';
import { AddUserComponent } from './components/users/add/add-user.component';
import { EditUserComponent } from './components/users/edit/edit-user.component';
import { DeleteUserComponent } from './components/users/delete/delete-user.component';
import { ListUsersComponent } from './components/users/list/list-users.component';

@NgModule({
  declarations: [
    AdminComponent,
    ListProjectsComponent,
    ListUsersComponent,
    AddProjectComponent,
    EditProjectComponent,
    DeleteProjectComponent,
    AddUserComponent,
    EditUserComponent,
    DeleteUserComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          {
            path: 'projects', component: ListProjectsComponent,
            children: [
              { path: 'add', component: AddProjectComponent },
              { path: 'edit/:id', component: EditProjectComponent },
              { path: 'delete/:id', component: DeleteProjectComponent }
            ]
          },
          {
            path: 'users', component: ListUsersComponent,
            children: [
              { path: 'add', component: AddUserComponent },
              { path: 'edit/:id', component: EditUserComponent },
              { path: 'delete/:id', component: DeleteUserComponent }
            ]
          },
        ],
        canActivate: [AuthGuard],
        data: { roles: [RolesEnum.Admin] }
      }
    ])
  ],
  providers: [],
})
export class AdminModule { }
