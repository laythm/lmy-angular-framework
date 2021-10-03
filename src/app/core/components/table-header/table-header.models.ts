export class TableHeaderColumns {
    columns: TableHeaderColumn[];

    constructor(_columns: TableHeaderColumn[]) {
        this.columns = _columns;
    }
}

export class TableHeaderColumn {
    name: string;
    displayName: string;
    sortable: boolean;
}

export class SortInfo {
    column: string;
    dir: 'asc' | 'desc' | '';
}