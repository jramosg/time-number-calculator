import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  constructor() {}

  performEvaluation(expression: string): number {
    try {
      const result = new Function(`'use strict'; return (${expression})`)();

      if (typeof result !== 'number' || isNaN(result)) {
        throw new Error('Invalid calculation result');
      }

      return result;
    } catch (error) {
      console.error('Error during evaluation:', error);
      throw new Error('Invalid expression');
    }
  }
}
