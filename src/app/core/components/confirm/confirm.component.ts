import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BaseModel } from '../../models/base.model';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html'
})

export class ConfirmComponent {
  @Output() onConfirm: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('modal') modal: ElementRef;

  text: string;

  constructor(private translateService: TranslateService) {

  }
 
  showDialog(text?: string) {
    if (!text) {
      this.text = this.translateService.instant('areYouSure');
    } else {
      this.text = text;
    }

    this.modal.nativeElement.style = "display: block; padding-right: 17px;";
  }

  close() {
    this.onConfirm.emit(false);
    this.hide();
  }

  clickEvent(res) {
    this.onConfirm.emit(res);
    this.hide();
  }

  hide() {
    this.text = '';
    this.modal.nativeElement.style = "";
  }
}