import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let mockRouter: any;

  beforeEach(() => {
    mockRouter = {
      navigate: jasmine
        .createSpy('navigate')
        .and.returnValue(Promise.resolve(true)),
    };

    TestBed.configureTestingModule({
      providers: [ErrorService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set error message', () => {
    service.setErrorMessage('Test Error');
    service.getErrorMessage().subscribe((message) => {
      expect(message).toBe('Test Error');
    });
  });

  it('should clear error message', () => {
    service.setErrorMessage('Test Error');
    service.clearErrorMessage();
    service.getErrorMessage().subscribe((message) => {
      expect(message).toBeNull();
    });
  });

  it('should navigate to a given path and clear error message', () => {
    service.setErrorMessage('Test Error');
    service.clearAndNavigate('/test-path');

    service.getErrorMessage().subscribe((message) => {
      expect(message).toBeNull();
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/test-path']);
  });

  it('should set error message and navigate to a given path', () => {
    service.setErrorAndNavigate('Test Error', '/error-path');

    service.getErrorMessage().subscribe((message) => {
      expect(message).toBe('Test Error');
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/error-path']);
  });

  it('should not navigate again if already navigating', () => {
    service.setErrorAndNavigate('First Error', '/error-path');
    service.setErrorAndNavigate('Second Error', '/another-path');

    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/error-path']);
  });
});
