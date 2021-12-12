import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpRequest, HttpResponse} from '@angular/common/http';
import {filter} from 'rxjs/operators';

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
  @Input()
  public featureFile: string;
  @Input()
  public labelFile: string;
  @Output()
  changeFile: EventEmitter<number> = new EventEmitter<number>();

  constructor(private  http: HttpClient) { }

  changeDataSet($event: MouseEvent): void{
    this.changeFile.emit(1);
  }

  ngOnInit(): void {
    if (this.featureFile == undefined || this.labelFile == undefined){
      console.log('need upload');
      this.uploadFlag = false;
    }
    else{
      // tslint:disable-next-line:max-line-length
      const req = new HttpRequest('GET', 'http://127.0.0.1:5000/checkdetectionresult?feature=' + this.featureFile + '&label=' + this.labelFile);
      this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
        (rest: HttpResponse<any>) => {
          this.calculatingFlag = rest.body['calculating'];
          this.hasMatrix = rest.body['matrix'];
          this.calculatedFlag = rest.body['calculated'];
          console.log(rest);
          console.log('hasmatrix' + this.hasMatrix);
          console.log('calcuated:' + this.calculatedFlag);
          console.log('calcuating:' + this.calculatingFlag);

          this.result = rest.body['payload'];
          console.log(this.result);
        },
      );
    }
  }

  calculateDataSet($event: MouseEvent): void{
    this.changeFile.emit(2);
  }

  getNoise($event: MouseEvent): void {
    const req = new HttpRequest('GET', 'http://127.0.0.1:5000/getnoise?feature=' + this.featureFile + '&label=' + this.labelFile);
    this.http.request(req).pipe(filter(e => e instanceof HttpResponse)).subscribe(
      (rest: HttpResponse<any>) => {
        console.log(rest);
        this.result = rest.body['result'];
        console.log(this.result);
        this.calculatedFlag = true;
      }
    );
  }
}
