import { Injectable } from '@angular/core';
import { ButtonValuesService } from './button-values.service';
import { EvaluationService } from './evaluation.service';

@Injectable({
  providedIn: 'root', // This makes the service available throughout the application
})
export class TimeService {
  constructor(
    private buttonValuesService: ButtonValuesService,
    private evaluationService: EvaluationService,
  ) {}

  pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  // Convert total minutes to HH:MM format
  convertMinutesToTime(totalMinutes: number): string {
    const isNegative = totalMinutes < 0;
    totalMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${isNegative ? '-' : ''}${this.pad(hours)}:${this.pad(minutes)}`;
  }

  // Convert HH:MM format to total minutes
  convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + (minutes || 0); // Convert to total minutes
  }

  // Evaluate a time expression (like '12:10 + 30:00')
  evaluateTimeExpression(expression: string): string {
    const adjustedExpression =
      this.buttonValuesService.adjustExpression(expression);
    const terms = adjustedExpression
      .split(/([\+\-\*\/])/)
      .map((term) => term.trim());
    let totalMinutes = 0;
    let expr = '';

    terms.forEach((term, index) => {
      if (term && this.isOperator(term)) {
        expr += term;
        return;
      }

      const minutes = this.convertTimeToMinutes(term);
      expr += minutes;
      console.log('aaa', terms[index - 1]);
      // totalMinutes += terms[index - 1] === '-' ? -minutes : minutes;
      console.log(expr); // Handle negative values
    });

    //return this.convertMinutesToTime(totalMinutes);
    return this.convertMinutesToTime(
      this.evaluationService.performEvaluation(expr),
    );
  }

  // Check if a value is an operator
  private isOperator(value: string): boolean {
    return ['+', '-', '*', '/'].includes(value);
  }
}
