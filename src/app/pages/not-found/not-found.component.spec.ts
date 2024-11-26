import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { NotFoundComponent } from './not-found.component';
import { ErrorService } from 'src/app/core/services/error.service';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockErrorService: any;

  beforeEach(async () => {
    mockErrorService = {
      getErrorMessage: jasmine
        .createSpy('getErrorMessage')
        .and.returnValue(of('Test Error Message')),
      setErrorAndNavigate: jasmine.createSpy('setErrorAndNavigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
      providers: [{ provide: ErrorService, useValue: mockErrorService }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the error page', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain(
      'Test Error Message'
    );
    expect(mockErrorService.getErrorMessage).toHaveBeenCalled();
  });

  it('should call clearError when button is clicked', () => {
    spyOn(component, 'clearError').and.callThrough();
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.clearError).toHaveBeenCalled();
    expect(mockErrorService.setErrorAndNavigate).toHaveBeenCalledWith(null,'/');
  });
});
