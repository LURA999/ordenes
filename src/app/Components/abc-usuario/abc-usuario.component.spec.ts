import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcUsuarioComponent } from './abc-usuario.component';

describe('AbcUsuarioComponent', () => {
  let component: AbcUsuarioComponent;
  let fixture: ComponentFixture<AbcUsuarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbcUsuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbcUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
