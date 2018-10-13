import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit
} from "@angular/core";
import { FormArrayName } from "@angular/forms";
import { TypedFormArray } from "@core";
import { Observable } from "rxjs";
import { distinctUntilChanged, map, startWith } from "rxjs/operators";
import { NestedItemFormGroup } from "./nested-item.form-group";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: "nested-items",
    templateUrl: "./nested-items.component.html"
})
export class NestedItemsComponent implements OnInit {
    @Input()
    public state: Backend.NestedItemState;
    public isEditable$: Observable<boolean>;
    public get formArray(): TypedFormArray<Backend.NestedItemModel> {
        return this.formArrayName.control as TypedFormArray<
            Backend.NestedItemModel
        >;
    }
    constructor(public formArrayName: FormArrayName) {}
    public ngOnInit(): void {
        this.isEditable$ = this.formArray.statusChanges.pipe(
            startWith(this.formArray.disabled),
            distinctUntilChanged(),
            map(() => !this.formArray.disabled)
        );
    }
    public addNestedItem(): void {
        const model = {
            id: null,
            name: null
        } as Backend.NestedItemModel;
        this.formArray.appendFormGroup(new NestedItemFormGroup(model));
    }

    public removeNestedItem(index: number): void {
        this.formArray.removeAt(index);
    }
}
