import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-noise-matrix',
  templateUrl: './noise-matrix.component.html',
  styleUrls: ['./noise-matrix.component.css']
})

export class NoiseMatrixComponent implements OnInit {
  @Input()
  public token: string;
  public result: number[][];
  displayedColumns: string[] = ['1', '2', '3', '4'];
  public uploadFlag = true;
  public calculatedFlag = false;
  public calculatingFlag = false;
  public content: string;
  private interval: any;
  constructor(private http: HttpClient) { }
  @Output()
  changeFile: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {
    // tslint:disable-next-line:max-line-length
    if (this.token == undefined){
      console.log('need upload');
      this.uploadFlag = true;
    }
    else{
      const req = new HttpRequest('GET', 'http://127.0.0.1:5000/checkstatus?token=' + this.token);
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (rest: HttpResponse<any>) => {
          console.log(rest);
          this.uploadFlag = !(rest.body['feature'] && rest.body['label']);
          console.log(this.uploadFlag);
          this.calculatingFlag = rest.body['calculating'];
          this.calculatedFlag = rest.body['calculated'];


          console.log('calcuated:' + this.calculatedFlag);
          console.log('calcuating:' + this.calculatingFlag);
          this.result = rest.body['payload'];
        },
      );
    }
  }
  changeDataSet($event: MouseEvent): void {
    this.changeFile.emit(1);
  }
  startCalculation($event: MouseEvent): void{
    console.log('start calculating');
    const req = new HttpRequest('GET', 'http://127.0.0.1:5000/calculate?token=' + this.token);
    this.http.request(req).subscribe(
      (rest: HttpResponse<any>) => {
        console.log(rest);
        if (rest.body != undefined) {
          this.calculatingFlag = false;
          this.calculatedFlag = true;
          console.log(rest.body.T);
          this.result = rest.body.T;
        }
      }
    );
    this.calculatingFlag = true;
    const getlogreq = new HttpRequest('GET', 'http://127.0.0.1:5000/getlog?file=' + this.token);
    this.interval = setInterval(() => {
      this.http.request(getlogreq).subscribe(
        (rest: HttpResponse<any>) => {
          if (rest.body != undefined) {
            console.log(rest.body.log);
            this.content = rest.body.log;
          }
          if (!this.calculatingFlag){
            clearInterval(this.interval);
          }
        }

      );
    }, 1000);
  }
  changePage($event: MouseEvent): void {
    this.changeFile.emit(3);
  }
}
