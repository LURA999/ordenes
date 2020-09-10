import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaOrdenesComponent } from './lista-ordenes.component';

describe('ListaOrdenesComponent', () => {
  let component: ListaOrdenesComponent;
  let fixture: ComponentFixture<ListaOrdenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaOrdenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaOrdenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
