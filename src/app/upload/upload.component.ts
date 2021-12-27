import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {observable, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {error} from 'protractor';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  FeatureFile: File = new File([], '');
  LabelFile: File = new File([], '');
  @Output()
  changePage: EventEmitter<number> = new EventEmitter<number>();
  @Input()
  feature: string;
  @Input()
  label: string;
  @Output()
  featureToken: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  labelToken: EventEmitter<string> = new EventEmitter<string>();

  code =
    '\tX_train # your feature numpy array\n' +
    '\tY_train # your label numpy array\n' +
    '\tnp.save([directory of your feature file],X_train)\n' +
    '\tnp.save([directory of your label file],Y_train)';
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
  }

  uploadFile(Body: FormData): Observable<any> {
    const req = new HttpRequest('POST', 'http://127.0.0.1:5000/upload', Body);
    return new Observable((observable) => {
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse))
        .subscribe((data) => {
          observable.next({
            status: 'success',
            body: data,
          });
        },
          (err) => {
            observable.error({
              status: 'fail',
              errorMsg : err,
            });
          }
        );
    });
  }

  changeFile($event: any, type: string) {
    console.log(type);
    const Formdata = new FormData();
    if (type == 'feature') {
      this.FeatureFile = $event.target.files[0];
      Formdata.append('file', $event.target.files[0]);
      Formdata.append('fileType', 'feature');
      this.uploadFile(Formdata).subscribe(
        res => {
          // @ts-ignore
          const result = res.body.body.fileid;
          console.log(result);
          this.feature = result;
          this.featureToken.emit(result);
          this.snackBar.open('Upload Success', 'Close');
        },
        err => {
          this.snackBar.open('Fail to Open Your File', 'RETRY');
        }
      );
      console.log('feature' + this.FeatureFile.name);
    } else if (type == 'label') {
      this.LabelFile = $event.target.files[0];
      Formdata.append('file', $event.target.files[0]);
      Formdata.append('fileType', 'label');
      this.uploadFile(Formdata).subscribe(
        res => {
          // @ts-ignore
          const result = res.body.body.fileid;
          console.log(result);
          this.label = result;
          this.labelToken.emit(result);
          this.snackBar.open('Upload Success', 'close');
        },
        err => {
          this.snackBar.open('Fail to Open Your File', 'RETRY');
        }
      );
    }

  }

  getNoise($event: MouseEvent): void {
    this.changePage.emit(2);
  }
}
