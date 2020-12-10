import { NgModule } from '@angular/core';
import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { PlatformComponent } from '@app/pages/platform/platform.component';
import { PlatformSharedModule } from '@app/pages/platform/platform.module';


@NgModule({
  imports: [
    PlatformSharedModule.forRoot(),
    <%= classify(name) %>RoutingModule
  ],
  exports: [],
  declarations: [],
  providers: [],
  bootstrap: [PlatformComponent]
})
export class <%= classify(name) %>Module { }

@NgModule({})
export class <%= classify(name) %>SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: <%= classify(name) %>Module,
      providers: []
    };
  }
}

