import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginatorComponent } from './components/paginator/paginator.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { MessageService } from './services/message.service';
import { HttpService } from './services/http.service';
// AoT requires an exported function for factories


@NgModule({
    declarations: [
        PaginatorComponent,
         AlertsComponent,
         TableHeaderComponent,
         ConfirmComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule,
    ],
    exports: [
         PaginatorComponent,
         AlertsComponent,
         TableHeaderComponent,
         ConfirmComponent
    ],
    providers: [
        HttpService,
        MessageService
    ]
})
export class CoreModule {
}  