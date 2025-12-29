import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";
import { SidebarService } from "../components/right-sidebar/right-sidebar.service";
import { routes } from "./core.routes";

export const CoreConfig: ApplicationConfig = {
    providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), SidebarService]
};
