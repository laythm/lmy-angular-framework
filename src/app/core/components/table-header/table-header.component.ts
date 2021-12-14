import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TableHeaderColumns,SortInfo } from '../..';
 
@Component({
  selector: '[table-header]',
  templateUrl: './table-header.component.html'
})
export class TableHeaderComponent {
  @Input() columns: TableHeaderColumns;
  @Input() disabled: boolean;
  @Input() sortInfo: SortInfo = new SortInfo();

  @ViewChildren('tblSortables', { read: ElementRef }) tblSortables: QueryList<ElementRef>;


  @Output() onSortChange: EventEmitter<SortInfo> = new EventEmitter();

  constructor(private translateService: TranslateService) {

  }

  clearSorting() {
    this.sortInfo = new SortInfo();
  }

  sortBy(event, column) {
    //this.resetTblSortablesIcons();
    if (this.sortInfo == null) {
      this.sortInfo=new SortInfo();
    }

    if (this.sortInfo.column != column) {
      this.sortInfo.column = column;
      this.sortInfo.dir = 'asc';
    }
    else if (this.sortInfo && this.sortInfo.dir == "asc") {
      this.sortInfo.dir = 'desc';

    } else {
      this.sortInfo.dir = 'asc';
    }

    let sortDirIcon = '';
    if (this.sortInfo && this.sortInfo.dir == 'asc') {
      sortDirIcon = 'fa-sort-up ml-1 fas';
    }
    else if (this.sortInfo && this.sortInfo.dir == 'desc') {
      sortDirIcon = 'fa-sort-down ml-1 fas';
    }

    let icon = event.currentTarget.querySelector('i');
    if (icon) {
      icon.className = sortDirIcon;
    }
    this.onSortChange.emit(this.sortInfo);
  }

}