import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['../../assets/nicepage.css', './about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  @Output()
  ChangePage: EventEmitter<number> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }
  changePage(input: number): void{
    this.ChangePage.emit(input);
  }

}
