import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  pure: false
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], key: string, query: string, caseInsensitive: 'I' | null = null): any {
    if (!items || !query) {
      return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    return items.filter(item => {
      if (typeof item === 'string') {
        return item.toLowerCase().includes(query.toLowerCase());
      } else if (Array.isArray(item)) {
        return item.indexOf(query) > -1;
      } else {
        return this.matchResult(item, key, query, caseInsensitive);
      }
    });
  }

  matchResult(item: any, key: string, query: string, caseInsensitive: 'I' | null) {
    let condition = false;
    const keys = key.split(",");
    for (const key of keys) {
      if (item[key]) {
        let source, target;
        if (caseInsensitive == 'I') {
          source = item[key].toString().toLowerCase();
          target = query.toString().toLowerCase();
        } else {
          source = item[key].toString();
          target = query.toString();
        }

        if (item[key] && source.includes(target)) {
          condition = true;
          break;
        }
      }
    }
    return condition;
  }
}
