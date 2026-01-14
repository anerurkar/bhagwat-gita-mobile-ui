import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaySandesh } from './today-sandesh';

describe('TodaySandesh', () => {
  let component: TodaySandesh;
  let fixture: ComponentFixture<TodaySandesh>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaySandesh]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaySandesh);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
