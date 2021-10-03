import { BaseModel } from "./base.model";

export class ListModel<T> extends BaseModel {
    list: T[];
    totalRecordsCount: number;
}