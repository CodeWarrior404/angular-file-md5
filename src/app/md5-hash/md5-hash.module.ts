import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Md5HashService } from './md5-hash.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    Md5HashService
  ],
  declarations: []
})
export class Md5HashModule { }
