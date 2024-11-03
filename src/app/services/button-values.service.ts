import { Injectable } from '@angular/core';

export type ButtonOperator = 'x' | '-' | '+' | '=' | '÷';
export type ButtonLabel = number | ':' | '.' | ButtonOperator;
export type Format = 'number' | 'time';

@Injectable({
  providedIn: 'root'
})
export class ButtonValuesService {
  private readonly operators: ButtonOperator[] = ['x', '-', '+', '=', '÷'];

  getButtonValues(selectedFormat: Format): ButtonLabel[] {
    return [
      7, 8, 9, 'x',
      4, 5, 6, '-',
      1, 2, 3, '+',
      0,
      selectedFormat === 'number' ? '.' : ':',
      '÷', '=',
    ];
  }

  isOperator(value: ButtonLabel): value is ButtonOperator {
    return this.operators.includes(value as ButtonOperator);
  }

  adjustExpression(expression: string): string {
    return expression.replace(/x|÷/g, (match) => (match === 'x' ? '*' : '/'));
  }
}
