import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoiseMatrixComponent } from './noise-matrix.component';

describe('NoiseMatrixComponent', () => {
  let component: NoiseMatrixComponent;
  let fixture: ComponentFixture<NoiseMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoiseMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoiseMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
