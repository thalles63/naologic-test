import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

/**
 * Formatter to display date as "MM.DD.YYYY" in the input
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {
    readonly DELIMITER = ".";

    parse(value: string): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                day: parseInt(date[1], 10),
                month: parseInt(date[0], 10),
                year: parseInt(date[2], 10)
            };
        }
        return null;
    }

    format(date: NgbDateStruct | null): string {
        return date ? String(date.month).padStart(2, "0") + this.DELIMITER + String(date.day).padStart(2, "0") + this.DELIMITER + date.year : "";
    }
}
