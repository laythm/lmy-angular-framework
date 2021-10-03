import { SortInfo } from "../components/table-header/table-header.models";

export class PagingSortingModel<T> {
    constructor(page?: number,pageSize?: number) {
        this.page = page;
        this.pageSize = pageSize;
        this.sortInfo=new SortInfo();
    }

    data: T;
    sortInfo: SortInfo;
    pageSize: number;
    page: number;
}