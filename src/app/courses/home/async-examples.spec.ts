import { fakeAsync, tick, flush, flushMicrotasks } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Examples', () => {
    it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
        let test = false;
        setTimeout(() => {
            console.log('Entra.')
            test = true;
            expect(test).toBeTruthy();

            done();
        }, 1000);
    });

    it('Asynchronous test example - setTimeout()', fakeAsync(() => {
        let test = false;
        setTimeout(() => {
            console.log('Running test assertion setTimeout().')
            test = true;
        }, 1000);

        // Util para avanzar el reloj y no pete el test.
        // tick(1000);

        // Flush NO sustituye a tick.
        flush();

        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - plain Promise', fakeAsync(() => {
        let test = false;
        
        console.log('Creating Promise.')
        
        Promise.resolve().then(() => {
            console.log('Promise first then() evaluated succesfully.')
            test = true;
            return Promise.resolve();
        }).then(() => {
            console.log('Promise second then() evaluated succesfully.')
        });

        // Las promesas están dentro de las microtareas, así que tenemos que usarlo para esperar que se resuelvan.
        flushMicrotasks()

        console.log('Running test assertion.');

        expect(test).toBeTruthy();
    }));

    it('Asynchronous test example - Promise + setTimeout()', fakeAsync(() => {
        let counter = 0;
        
        console.log('Creating Promise.')
        
        Promise.resolve().then(() => {
            console.log('Promise first then() evaluated succesfully.')
            
            counter+=10;
            
            setTimeout(() => {
                counter+=1;
            }, 1000);
            
            return Promise.resolve();
        }).then(() => {
            console.log('Promise second then() evaluated succesfully.')
        });

        expect(counter).toEqual(0);

        // Las promesas están dentro de las microtareas, así que tenemos que usarlo para esperar que se resuelvan.
        flushMicrotasks();

        console.log('Running test assertion.');

        expect(counter).toEqual(10);

        flush(); // También podría usar un tick(1000); o dos tick(500);

        expect(counter).toEqual(11);
    }));

    it('Asynchronous test example - Observable', fakeAsync(() => {
        let test = false;
        
        console.log('Creating Observable.')
        
        // Sin el pipe es síncrono y no peta.
        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });

        tick(1000);

        expect(test).toBe(true);
    }));
});