import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const date = new Date(value);

    const dayName = date.toLocaleString('en-US', { weekday: 'short' });

    const monthName = date.toLocaleString('en-US', { month: 'short' });

    const day = date.getDate();

    const suffix = this.getDaySuffix(day);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${dayName}. ${monthName}. ${day}${suffix} at ${hours}:${minutes}`;
  }

  private getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) {
      return 'th';
    }

    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }
}
