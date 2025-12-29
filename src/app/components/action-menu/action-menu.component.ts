import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, inject, Output, signal } from "@angular/core";

@Component({
    selector: "app-action-menu",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./action-menu.component.html",
    styleUrl: "./action-menu.component.scss"
})
export class ActionMenuComponent {
    private elementRef = inject(ElementRef);

    @HostListener("document:click", ["$event"])
    onClickOutside(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    @Output() edit = new EventEmitter<void>();
    @Output() delete = new EventEmitter<void>();

    public isOpen = signal(false);

    toggleMenu() {
        this.isOpen.update((v) => !v);
    }

    onEditClick() {
        this.edit.emit();
        this.isOpen.set(false);
    }

    onDeleteClick() {
        this.delete.emit();
        this.isOpen.set(false);
    }
}
