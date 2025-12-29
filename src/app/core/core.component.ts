import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "../components/header/header.component";

@Component({
    selector: "app-core",
    standalone: true,
    imports: [RouterOutlet, HeaderComponent],
    templateUrl: "./core.component.html"
})
export class CoreComponent {}
