import { BaseModel } from "src/app/core";
import { RoleModel } from "./role.model";

export class UserLookupsModel extends BaseModel  {
    roles?: RoleModel[];
}