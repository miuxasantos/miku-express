import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteListar } from './cliente-listar';

describe('ClienteListar', () => {
  let component: ClienteListar;
  let fixture: ComponentFixture<ClienteListar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClienteListar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteListar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
