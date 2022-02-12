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
  public enteredToken = '';
  @Input()
  token: string;
  @Output()
  changeToken: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  changePage: EventEmitter<number> = new EventEmitter<number>();

  code =
    '\tX_train # your feature numpy array\n' +
    '\tY_train # your label numpy array\n' +
    '\tnp.save([directory of your feature file],X_train)\n' +
    '\tnp.save([directory of your label file],Y_train)';
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    console.log(this.token);
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

  changeFile($event: any, type: string): void {
    console.log(type);
    const Formdata = new FormData();
    Formdata.append('file', $event.target.files[0]);
    Formdata.append('fileType', type);
    console.log($event.target.files[0].filename);
    if (this.token != undefined){
      Formdata.append('token', this.token);
    }
    this.uploadFile(Formdata).subscribe(
      res => {
        this.token = res.body.body.token;
        this.changeToken.emit(this.token);
        this.snackBar.open('Upload Success', 'Close');
      }
    );
  }

  getNoise($event: MouseEvent): void {
    this.changePage.emit(2);
  }

  enterToken($event: MouseEvent): void {
    console.log(this.enteredToken);
    const req = new HttpRequest('GET', 'http://127.0.0.1:5000/checktoken?token=' + this.enteredToken);
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
      (rest: HttpResponse<any>) => {
        console.log(rest);
        if (rest.body.has_token){
          this.token = this.enteredToken;
          this.changeToken.emit(this.token);
        }
      },
    );
  }
}
