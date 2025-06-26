import { Pipe, PipeTransform, ChangeDetectorRef, EventEmitter } from '@angular/core';
/**
 * Replaces spaces into the new character
 */
@Pipe({
    name: 'replacespaces',
    pure: false
})
export class ReplaceSpacesPipe implements PipeTransform {
    transform(value1: string, value2: string): any {
        const result = value1.trim().replace(new RegExp(' ', 'g'), value2);
        return result;
    }
}
