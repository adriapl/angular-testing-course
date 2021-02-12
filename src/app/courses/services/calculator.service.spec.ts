import { CalculatorService } from './calculator.service';
import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {
    let calculator: CalculatorService;
    let loggerSpy: any;
    
    beforeEach(() => {
        // Implementación FAKE del LoggerService. Objeto creado por Jasmine que contiene un método 'log'.
        // Al hacer esto, las instancias en cada 'it' serán distintas y no interferirán entre ellas (ISOLATION).
        loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);

        TestBed.configureTestingModule({
            providers: [
                CalculatorService,
                { provide: LoggerService, useValue: loggerSpy }
            ]
        });

        calculator = TestBed.get(CalculatorService);
    });

    it('should add two numbers', () => {
        const result = calculator.add(2, 3);

        expect(result).toEqual(5);
        
        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });

    it('should substract two numbers', () => {
        const result = calculator.subtract(5, 3);

        expect(result).toEqual(2, 'Unexpected subtraction result.');

        expect(loggerSpy.log).toHaveBeenCalledTimes(1);
    });
})