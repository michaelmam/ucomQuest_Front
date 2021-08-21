import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxLength'
})
export class MaxLengthPipe implements PipeTransform {
  transform(value: string, limit: number){
    if (value && value.length > limit) return value.substring(0, limit) + '...';
    else return value;
  }
}
