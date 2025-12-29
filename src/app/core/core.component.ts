import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-core",
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: "./core.component.html"
})
export class CoreComponent {}
