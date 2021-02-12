import {async, ComponentFixture, fakeAsync, TestBed, flush, flushMicrotasks} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {CoursesService} from '../services/courses.service';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let element: DebugElement;
  let coursesService: any; // Tiene que ponerse any y no del tipo CoursesService por que el TestBed.get devuelve any y no coinciden los tipos.

  const beginnerCourses = setupCourses().filter(courses => courses.category === 'BEGINNER');
  
  const advancedCourses = setupCourses().filter(courses => courses.category === 'ADVANCED');

  beforeEach(async(() => { // También podríamos usar fakeAsync y al final (después del then()) poner un flushMicrotasks().

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses'])

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule // Deshabilitamos las animaciones.
      ],
      providers: [
        { provide: CoursesService, useValue: coursesServiceSpy }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        coursesService = TestBed.get(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginnerCourses));
    
    fixture.detectChanges();
    
    const tabs = element.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found.');
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses));
    
    fixture.detectChanges();
    
    const tabs = element.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found.');
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    
    fixture.detectChanges();
    
    const tabs = element.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Expected to find 2 tabs.');
  });


  it("should display advanced courses when tab clicked", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    
    fixture.detectChanges();

    const tabs = element.queryAll(By.css('.mat-tab-label'));

    // element.nativeElement.click();
    click(tabs[1]);

    fixture.detectChanges();

    flush(); // flushMicrotasks aquí no serviría por que no es promesa, no es microtarea. También valdría tick(16) que es lo que dura la animación.

    const cardTitles = element.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles.');

    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  }));

  // it("should display advanced courses when tab clicked - async", async(() => {
  //   coursesService.findAllCourses.and.returnValue(of(setupCourses()));
    
  //   fixture.detectChanges();

  //   const tabs = element.queryAll(By.css('.mat-tab-label'));

  //   // element.nativeElement.click();
  //   click(tabs[1]);

  //   fixture.detectChanges();

  //   // Con Async no puedes usar flush().
  //   fixture.whenStable().then(() => {
  //     const cardTitles = element.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

  //     expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles.');
  
  //     expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
  //   });
  // }));
});


