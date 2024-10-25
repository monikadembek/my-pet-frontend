import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideHttpClient } from '@angular/common/http';
import { AuthApiService } from '../../services/auth-api.service';
import { Observable, of } from 'rxjs';

const AuthApiServiceMock = {
  register({ name: string; email: string; passsword: string}): Observable<any> {
    return of({})
  }
};

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        {
          provide: AuthApiService,
          useValue: AuthApiServiceMock
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit the form when form is valid', () => {
    component.ngOnInit();
    component.registerForm.controls['name'].setValue('user');
    component.registerForm.controls['email'].setValue('user@email.com');
    component.registerForm.controls['password'].setValue('password');
    component.registerForm.controls['confirmPassword'].setValue('password');
    fixture.debugElement.nativeElement
      .querySelector('button[type="submit"]')
      .click();
    
  });
});
