import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'standardizeAssayType'
})

// Standardize inputs from data
export class StandardizeAssayTypePipe implements PipeTransform {

  transform(value: string): string {
    let dict = [
      { label: 'high-content imaging', values: ['high-content imaging', 'high content', 'high-content', 'high content imaging'] },
      { label: 'cell-based', values: ['cell-based', 'cell based'] },
      { label: 'hci', values: ['high-content imaging'] },
      { label: 'cell viability', values: ['cell viability', 'viability'] },
    ];

    let idx = dict.findIndex(d => d.values.includes(value.trim().toLowerCase()));

    if (idx > -1) {
      return (dict[idx]['label'].toLowerCase())
    }
    return value.toLowerCase();
  }

}
