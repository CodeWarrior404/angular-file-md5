import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Md5HashModule } from './md5-hash/md5-hash.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Md5HashModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
