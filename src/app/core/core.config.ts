import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";

export const CoreConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true })]
};
