import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-noise-matrix',
  templateUrl: './noise-matrix.component.html',
  styleUrls: ['./noise-matrix.component.css' , '../../assets/nicepage.css']
})

export class NoiseMatrixComponent implements OnInit {
  public stepProgress = 0;
  public batchProgress = 0;
  public batchProgress$: Observable<number> = new Observable(observer => {
    setInterval(() => observer.next(this.batchProgress), 100);
  });
  public stepProgress$: Observable<number> = new Observable(observer => {
    setInterval(() => observer.next(this.stepProgress), 100);
  });
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
    //
    else{
      const req = new HttpRequest('GET', '/api/estimation?token=' + this.token);
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (rest: HttpResponse<any>) => {
          console.log(rest);
          this.uploadFlag = rest.body.featureFile == null || rest.body.labelFile == null;
          console.log(this.uploadFlag);
          this.calculatingFlag = ! (rest.body.matrixLog === '');
          this.calculatedFlag = ! (rest.body.T == null);
          console.log('calcuated:' + this.calculatedFlag);
          console.log('calcuating:' + this.calculatingFlag);
          this.result = rest.body.T;
          this.content = rest.body.matrixLog;
        },
      );
    }
  }
  startCalculation($event: MouseEvent): void{
    console.log('start calculating');
    const req = new HttpRequest('GET', '/api/estimation/calculate?token=' + this.token);
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
    const getlogreq = new HttpRequest('GET', '/api/log?token=' + this.token);
    this.interval = setInterval(() => {
      this.http.request(getlogreq).subscribe(
        (rest: HttpResponse<any>) => {
          if (rest.body != undefined) {
            console.log(rest.body);
            this.batchProgress = rest.body.batchProgress;
            this.stepProgress = rest.body.stepProgress;
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
