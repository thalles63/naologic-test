import { CommonModule } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { NgbDateAdapter, NgbDateParserFormatter, NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { CustomDateAdapter } from "./custom-date-adapter";
import { CustomDateParserFormatter } from "./custom-date-parser-formatter";

@Component({
    selector: "app-date-input",
    standalone: true,
    imports: [CommonModule, NgbDatepickerModule, ReactiveFormsModule, FormsModule],
    templateUrl: "./date-input.component.html",
    styleUrls: ["./date-input.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateInputComponent),
            multi: true
        },
        { provide: NgbDateAdapter, useClass: CustomDateAdapter },
        { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
    ]
})
export class DateInputComponent implements ControlValueAccessor {
    @Input() placeholder: string = "YYYY-MM-DD";

    value: string | null = null;
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

    onDateSelect(value: any) {
        this.onChange(value);
    }
}
