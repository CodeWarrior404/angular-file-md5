import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Md5HashService } from './md5-hash/md5-hash.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  selectedFile: File;
  progressPercent = 0;
  md5Checksum: string;

  constructor(
    private md5HashService: Md5HashService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
  }

  fileSelectionChangeHandler(event): void {
    this.selectedFile = event.srcElement.files[0];
    this.md5HashService.generateMD5HashForFile(this.selectedFile)
      .subscribe(data => {
        switch (data.type) {
          case 'status':
            console.log(data.message + '%');
            this.progressPercent = data.message;
            break;
          case 'checksum':
            this.md5Checksum = data.message;
            break;
        }
        this.changeDetectorRef.detectChanges();
      });
  }
}
