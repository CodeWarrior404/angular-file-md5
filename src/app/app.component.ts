import { Component, OnInit } from '@angular/core';
import { Md5HashService } from './md5-hash/md5-hash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedFile: File;

  constructor(
    private md5HashService: Md5HashService
  ) {}

  ngOnInit() {
  }

  fileSelectionChangeHandler(event): void {
    this.selectedFile = event.srcElement.files[0];
    this.md5HashService.generateMD5HashForFile(this.selectedFile);
  }
}
