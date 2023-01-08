import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {observable, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css', '../../assets/nicepage.css']
})
export class UploadComponent implements OnInit {
  public featureFile = '';
  public labelFile = '';
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
    this.getFileName(this.token);
  }

getFileName(token: string): void{
  if (token != undefined) {
    const req = new HttpRequest('GET', '/api/estimation?token=' + this.token);
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
      (rest: HttpResponse<any>) => {
        this.featureFile = rest.body.featureFile;
        this.labelFile = rest.body.labelFile;
      });
  }
}
  uploadFile(Body: FormData): Observable<any> {
    const req = new HttpRequest('POST', '/api/file/upload', Body);
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
        console.log(res.body);
        this.changeToken.emit(this.token);
        this.snackBar.open('Upload Success', 'Close');
      }
    );
    this.getFileName(this.token);
  }

  enterToken($event: MouseEvent): void {
    const req = new HttpRequest('GET', '/api/file/checktoken?token=' + this.enteredToken);
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
      (rest: HttpResponse<any>) => {
        if (rest.body.has_token){
          this.token = this.enteredToken;
          this.changeToken.emit(this.token);
          this.getFileName(this.token);
        }
      },
    );
  }
}
