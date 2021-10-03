import { ThrowStmt } from '@angular/compiler';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html'
})

export class PaginatorComponent {
  @Input() pageSize = 0;
  @Input() totalItemsCount = 0;
  @Input() activePage: number = 0;

  @Input() disabled: boolean;
  @Output() onPageChange: EventEmitter<number> = new EventEmitter();
  pageCount: number;

  constructor(public translate: TranslateService) {

  }

  ngOnChanges(changes: SimpleChanges) {
    let change = changes["totalItemsCount"];
    
    if (change) {
      if (change.previousValue != change.currentValue) {
        this.pageCount = this.getPageCount();
      }
    }
  }

  private getPageCount(): number {
    let totalPage = 0;

    if (this.totalItemsCount > 0 && this.pageSize > 0) {
      const pageCount = this.totalItemsCount / this.pageSize;
      const roundedPageCount = Math.floor(pageCount);

      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }

    return totalPage;
  }

  onClickPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.pageCount) {
      this.activePage = pageNumber;
      this.onPageChange.emit(this.activePage);
    }
  }
}