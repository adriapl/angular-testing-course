import { CoursesService } from './courses.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { COURSES, findLessonsForCourse } from '../../../../server/db-data';
import { Course } from '../model/course';
import { HttpErrorResponse } from '@angular/common/http';

describe('CoursesService', () => {
    let coursesService: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CoursesService
            ]
        });

        coursesService = TestBed.get(CoursesService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should retrieve all courses', () => {
        coursesService.findAllCourses().subscribe(courses => {
            // Devuelve algo.
            expect(courses).toBeTruthy('No courses returned.');
            expect(courses.length).toBe(12, 'Incorrect number of courses.');

            const course = courses.find(course => course.id === 12);
            expect(course.titles.description).toBe('Angular Testing Course', 'Incorrect description title.');

        });

        // Nos aseguramos que llama a esta URL particular.
        const req = httpTestingController.expectOne('/api/courses');
        expect(req.request.method).toEqual("GET");

        // Cuando se llama al FLUSH, el mock HTTP simula la respuesta pasando al subscribe los cursos.
        req.flush({ payload: Object.values(COURSES) });
    });

    it('should find a course by id', () => {
        coursesService.findCourseById(12).subscribe(course => {
            // Devuelve algo.
            expect(course).toBeTruthy('No course returned.');
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("GET");

        // Cuando se llama al FLUSH, el mock HTTP simula la respuesta pasando al subscribe los cursos.
        req.flush(COURSES[12]);
    });

    it('should save the course data', () => {
        const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

        coursesService.saveCourse(12, changes).subscribe(course => {
            expect(course.id).toBe(12);
        });

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");

        expect(req.request.body.titles.description).toEqual(changes.titles.description);

        // Sobreescribimos el título original con el que nos inventamos (Testing Course).
        req.flush({
            ...COURSES[12],
            ...changes
        });
    });

    it('should give and error if save course fails', () => {

        const changes: Partial<Course> = { titles: { description: 'Testing Course' } };

        coursesService.saveCourse(12, changes).subscribe(
            () => fail('The save course operation should have failed'),
            (error: HttpErrorResponse) => {
                expect(error.status).toBe(500);
            }
        );

        const req = httpTestingController.expectOne('/api/courses/12');
        expect(req.request.method).toEqual("PUT");

        req.flush('Save course failed', { status: 500, statusText: 'Interval Server Error' });
    });

    it('should find a lesson', () => {
        coursesService.findLessons(12).subscribe(lessons => {
            // Devuelve algo.
            expect(lessons).toBeTruthy('No lessons returned.');
            expect(lessons.length).toBe(3);
        });

        const req = httpTestingController.expectOne(req => req.url === '/api/lessons');
        expect(req.request.method).toEqual("GET");

        expect(req.request.params.get("courseId")).toEqual("12");
        expect(req.request.params.get("filter")).toEqual("");
        expect(req.request.params.get("sortOrder")).toEqual("asc");
        expect(req.request.params.get("pageNumber")).toEqual("0");
        expect(req.request.params.get("pageSize")).toEqual("3");

        // Cuando se llama al FLUSH, el mock HTTP simula la respuesta pasando al subscribe los cursos.
        req.flush({
            payload: findLessonsForCourse(12).slice(0, 3) // Cogemos sólo los que necesitamos, 3.
        });
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});