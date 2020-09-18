import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetotpComponent } from './getotp.component';

describe('GetotpComponent', () => {
  let component: GetotpComponent;
  let fixture: ComponentFixture<GetotpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetotpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
