import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string | Date, format: string = 'dd/MM/yyyy'): string {
    if (!value) return '';
    // Convert value to a Date object if it's a string
    const date = new Date(value);
    return formatDate(date, format, 'en-US');
  }
}
