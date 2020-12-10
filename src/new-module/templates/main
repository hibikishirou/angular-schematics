import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { <%= classify(name) %>Module } from './<%= dasherize(name) %>.module';
import { environment } from '@environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(<%= classify(name) %>Module)
  .catch(err => console.error(err));
