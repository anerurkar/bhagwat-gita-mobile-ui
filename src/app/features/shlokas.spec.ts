import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shlokas } from './shlokas';

describe('Shlokas', () => {
  let component: Shlokas;
  let fixture: ComponentFixture<Shlokas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shlokas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Shlokas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
