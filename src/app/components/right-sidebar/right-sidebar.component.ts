import { CommonModule } from "@angular/common";
import { Component, inject, output } from "@angular/core";
import { SidebarService } from "./right-sidebar.service";

@Component({
    selector: "app-right-sidebar",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./right-sidebar.component.html",
    styleUrl: "./right-sidebar.component.scss"
})
export class RightSidebarComponent {
    private readonly sidebarService = inject(SidebarService);
    public readonly isOpen = this.sidebarService.isOpen;
    public readonly onClose = output<void>();

    public close() {
        this.sidebarService.close();
        this.onClose.emit();
    }
}
