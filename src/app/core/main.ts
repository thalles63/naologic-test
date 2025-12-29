import { bootstrapApplication } from "@angular/platform-browser";
import { CoreComponent } from "./core.component";
import { CoreConfig } from "./core.config";

bootstrapApplication(CoreComponent, CoreConfig).catch((err) => console.error(err));
