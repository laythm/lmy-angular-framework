export class BaseModel {

    constructor(_successes: string[] = [], _errors: string[] = []) {
        this.successes = _successes;
        this.errors = _errors;
    }

    successes: string[];
    errors: string[];

    append(basemodel: BaseModel) {
        this.successes.push.apply(this.successes, basemodel.successes);
        this.errors.push.apply(this.errors, basemodel.errors);
    }

    clear(clearSuccesses = true, clearErrors = true) {
        if (clearSuccesses) {
            this.successes = [];
        }

        if (clearErrors) {
            this.errors = [];
        }
    }

    get hasError(): boolean {
        return this.errors.length > 0;
    };

    get hasSuccess(): boolean {
        return this.successes.length > 0;
    };
}