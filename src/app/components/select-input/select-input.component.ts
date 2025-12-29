import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input, TemplateRef } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
    selector: "app-select-input",
    standalone: true,
    imports: [CommonModule, NgSelectModule, ReactiveFormsModule, FormsModule],
    templateUrl: "./select-input.component.html",
    styleUrls: ["./select-input.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectInputComponent),
            multi: true
        }
    ]
})
export class SelectInputComponent implements ControlValueAccessor {
    @Input() items: any[] = [];
    @Input() bindLabel: string = "label";
    @Input() bindValue: string = "value";
    @Input() placeholder: string = "";
    @Input() clearable: boolean = false;

    @Input() labelTemplate: TemplateRef<any> | null = null;

    value: any;
    disabled: boolean = false;

    onChange = (value: any) => {};
    onTouched = () => {};

    writeValue(value: any): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onModelChange(value: any) {
        this.value = value;
        this.onChange(value);
    }
}
