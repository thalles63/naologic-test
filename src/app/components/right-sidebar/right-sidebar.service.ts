import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class SidebarService {
    public readonly isOpen = signal(false);

    public open() {
        this.isOpen.set(true);
    }

    public close() {
        this.isOpen.set(false);
    }
}
