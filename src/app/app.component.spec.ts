//import { AppName } from './../../node_modules/webpack-dev-server/node_modules/open/index.d';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { OlympicsService } from './core/services/olympics.service';

describe('AppComponent', () => {
  let mockOlympicsService: any;

  beforeEach(async () => {
    mockOlympicsService = {
      loadInitialData: jasmine.createSpy('loadInitialData').and.returnValue({
        pipe: () => ({
          subscribe: jasmine.createSpy('subscribe'),
        }),
      }),
    };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        { provide: OlympicsService, useValue: mockOlympicsService },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'olympic-games-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.name).toEqual('olympic-games-app');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain(
      'olympic-games-app app is running!'
    );
  });
});
