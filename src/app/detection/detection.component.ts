import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';
import {start} from 'repl';

@Component({
  selector: 'app-detection',
  templateUrl: './detection.component.html',
  styleUrls: ['./detection.component.css']
})
export class DetectionComponent implements OnInit {
  public calculatedFlag = false;
  public calculatingFlag = false;
  public hasMatrix = false;
  public uploadFlag: boolean;
  public result: number[];
  public start = 0;
  @Input()
  public token: string;
  @Output()
  changeFile: EventEmitter<number> = new EventEmitter<number>();

  constructor(private  http: HttpClient) { }

  changeDataSet($event: MouseEvent): void{
    this.changeFile.emit(1);
  }

  ngOnInit(): void {
    if (this.token == undefined){
      console.log('need upload');
      this.uploadFlag = true;
    }
    else{
      // tslint:disable-next-line:max-line-length
      const req = new HttpRequest('GET', 'http://127.0.0.1:5000/checkdetectionresult?token=' + this.token);
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (rest: HttpResponse<any>) => {
          this.calculatingFlag = rest.body.calculating;
          this.uploadFlag = !(rest.body['feature'] && rest.body['label']);

          this.hasMatrix = rest.body.matrix;
          this.calculatedFlag = rest.body.calculated;
          console.log(rest);
          console.log(this.uploadFlag);
          console.log('hasmatrix' + this.hasMatrix);
          console.log('calcuated:' + this.calculatedFlag);
          console.log('calcuating:' + this.calculatingFlag);

          this.result = rest.body.payload;
          console.log(this.result);
        },
      );
    }
  }

  calculateDataSet($event: MouseEvent): void{
    this.changeFile.emit(2);
  }

  getNoise($event: MouseEvent): void {
    const req = new HttpRequest('GET', 'http://127.0.0.1:5000/getnoise?token=' + this.token);
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
      (rest: HttpResponse<any>) => {
        console.log(rest);
        this.result = rest.body.result;
        console.log(this.result);
        this.calculatedFlag = true;
      }
    );
  }

  increase(): void{
    if (this.start < this.result.length - 10){
      this.start += 10;
    }
  }
  decrease(): void{
    if (this.start >= 10){
      this.start -= 10;
    }
  }
}
