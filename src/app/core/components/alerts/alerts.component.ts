import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy, KeyValueDiffer, KeyValueDiffers } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BaseModel } from '../../models/base.model';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html'
})

export class AlertsComponent {
  @Input() basemodel: BaseModel;
  displayBasemodel: BaseModel;

  constructor(
    private translateService: TranslateService,
  ) {

  }

  ngOnChanges() {

  }
  closeAlert(type: 'success' | 'error') {
    if (type == "success") {
      this.basemodel.successes = [];
    } else if (type == "error") {
      this.basemodel.errors = [];
    }
  }
}