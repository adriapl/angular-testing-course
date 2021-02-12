import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>; // Nos ayuda a hacer operaciones comunes como obtener una instancia del componente o debugger.
  let element: DebugElement;

  // El async (no tiene nada que ver con el de las promesas), se usa para evitar que se ejecuten los tests antes de se resuelva la promesa de compileComponents.
  // Async espera un tiempo establecido por defecto (timeout de 5 segundos) para cualquier operación asíncrona (básicamente la espera).
  // Ver que nuestro componente está prearado antes de que las SPECS sean ejecutadas.
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoursesModule]
    })
      .compileComponents() // Promesa que se ejecuta cuando se compila el componente.
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
      }); 
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display the course list", () => {
    component.courses = setupCourses();

    // Después de asignar datos a un componente vía Input (lo de arriba), tenemos que notificar al componente que se han hecho cambios.
    fixture.detectChanges();

    // console.log(element.nativeElement.outerHTML);

    // Identificar un elemento del DOM.
    const cards = element.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('Could not find cards.');

    expect(cards.length).toBe(12, 'Unexpected number of courses.');
  });


  it("should display the first course", () => {
    component.courses = setupCourses();

    fixture.detectChanges();

    const course = component.courses[0];

    const card = element.query(By.css('.course-card:first-child'));
    
    expect(card).toBeTruthy('Could not find course card.');

    const title = element.query(By.css('mat-card-title'));

    expect(title.nativeElement.textContent).toBe('Angular Testing Course');

    const image = element.query(By.css('img'));

    expect(image.nativeElement.src).toBe(course.iconUrl);
  });
});


