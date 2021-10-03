import { BaseModel } from "src/app/core";

export class ProjectModel extends BaseModel {
    constructor(id?, title?) {
        super();
        this.id = id;
        this.title = title;
    }

    id?: string;
    title?: string;
    description?: string;
}

export class ProjectSearchModel  {
    title?: string;
    description?: string;
}