import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import {
  ButtonValuesService,
  ButtonLabel,
  Format,
  ButtonOperator,
} from './services/button-values.service';
import { TimeService } from './services/time.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    MatButtonModule,
    MatGridListModule,
    MatIconModule,
    MatRadioModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentInput: string = '';
  lastPressed: ButtonLabel | null = null;
  selectedFormat: Format = 'number';
  buttonValues: ButtonLabel[] = [];
  lastEvaluated: string = '';

  constructor(
    private buttonValuesService: ButtonValuesService,
    private timeService: TimeService,
  ) {
    this.loadButtonValues();
  }

  private loadButtonValues(): void {
    this.buttonValues = this.buttonValuesService.getButtonValues(
      this.selectedFormat,
    );
  }

  onFormatSelection(event: MatRadioChange): void {
    this.selectedFormat = event.value;
    this.loadButtonValues();
  }

  isOperator(value: ButtonLabel): value is ButtonOperator {
    return this.buttonValuesService.isOperator(value); // Use the service method
  }

  isButtonDisabled(value: ButtonLabel): boolean {
    return (value === 'x' || value === '÷') && this.selectedFormat === 'time';
  }

  private sanitizeExpression(expression: string): string {
    const adjustedExpression =
      this.buttonValuesService.adjustExpression(expression);
    return adjustedExpression.replace(/[^0-9+\-*/(). ]/g, '');
  }

  private isTimeFormat(): boolean {
    return this.selectedFormat === 'time';
  }

  private performEvaluation(expression: string): number {
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

  private evaluateExpression(expression: string): number | string {
    if (this.isTimeFormat()) {
      return this.timeService.evaluateTimeExpression(expression);
    }
    const sanitizedExpression = this.sanitizeExpression(expression);

    if (!sanitizedExpression.trim()) {
      return '';
    }
    return this.performEvaluation(sanitizedExpression);
  }

  handleButtonClick(value: ButtonLabel): void {
    this.lastEvaluated = '';
    if (this.currentInput === 'Error') {
      this.currentInput = '';
    }

    if (this.lastPressed === '=' && !this.isOperator(value)) {
      this.currentInput = value.toString();
    } else if (value === '=') {
      this.evaluateAndSetResult();
    } else {
      this.currentInput += value.toString();
    }
    this.lastPressed = value;
  }

  private evaluateAndSetResult(): void {
    try {
      const result = this.evaluateExpression(this.currentInput);
      this.lastEvaluated = this.currentInput;
      this.currentInput = result.toString();
    } catch (error) {
      console.error('Error evaluating expression:', error);
      this.currentInput = 'Error';
    }
  }

  handleDeleteClick(): void {
    this.lastEvaluated = '';
    this.currentInput = '';
  }

  handleBackSpaceClick(): void {
    this.lastEvaluated = '';
    this.currentInput = this.currentInput.slice(0, -1);
  }
}
