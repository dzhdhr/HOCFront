import { Component } from '@angular/core';
import {$E} from 'codelyzer/angular/styles/chars';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HOCFront';
  featureToken: string;
  labelToken: string;
  selected = new FormControl(0);
  changeFeatureFile(event: string): void  {
    console.log('feature', event);
    this.featureToken = event;
  }

  changeLabelFile(event: string): void {
    console.log('label', event);
    this.labelToken = event;
  }

  changeFile(event: number): void {
    this.selected.setValue(event);
    console.log('change');
  }
}
