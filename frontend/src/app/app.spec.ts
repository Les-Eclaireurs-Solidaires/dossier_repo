import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { NavMenuComponent } from './shared/component/nav-menu.component/nav-menu.component';
import { ActivatedRoute, provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App,NavMenuComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
