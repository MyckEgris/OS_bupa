import { Pipe, PipeTransform, ChangeDetectorRef, EventEmitter } from '@angular/core';
/**
 * Transform dates in custom formats based on translate formats
 */
@Pipe({
  name: 'concatenate',
  pure: false
})
export class ConcatenatePipe implements PipeTransform {
    transform(value1: string, value2: string): any {
        return `${value1}${value2}`;
    }
}
