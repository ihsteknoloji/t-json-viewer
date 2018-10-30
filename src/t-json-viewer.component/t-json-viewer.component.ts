/* tslint:disable */

import {Component, Input, OnChanges} from '@angular/core';

export interface Item {
  key: string;
  value: any;
  title: string;
  type: string;
  isOpened: boolean;
}

@Component({
  selector: 't-json-viewer',
  templateUrl: './t-json-viewer.component.html',
  styleUrls: ['./t-json-viewer.component.css']
})
export class TJsonViewerComponent implements OnChanges {

  @Input()
  json: Array<any> | Object | any;
  
  @Input()
  maxCollapsedLength: number;

  @Input()
  expandAll: false;

  @Input()
  filterText: null;

  public asset: Array<Item> = [];

  constructor() { }

  ngOnChanges() {
    // Do nothing without data
    if (typeof (this.json) !== 'object' && !Array.isArray(this.json)) {
      return;
    }

    // Make the asset array empty again
    this.asset = [];

    /**
     * Convert json to array of items
     */
    Object.keys(this.json).forEach((key) => {
      this.asset.push(this.createItem(key, this.json[key]));
    });

    if (this.expandAll) {
      this.asset.forEach(element => {
        this.clickHandle(element);
      });
    }
  }

  /**
   * Check value and Create item object
   * @param {string|any} key
   * @param {any} value
   */
  private createItem(key: any, value: any): Item {
    let item: Item = {
      key: key || '""', // original key or empty string
      value: value, // original value
      title: value, // title by default
      type: undefined,
      isOpened: false // closed by default
    };

    if (typeof (item.value) === 'string') {
      item.type = 'string';
      item.title = `"${item.value}"`;

    } else if (typeof (item.value) === 'number') {
      item.type = 'number';

    } else if (typeof (item.value) === 'boolean') {
      item.type = 'boolean';

    } else if (item.value instanceof Date) {
      item.type = 'date';

    } else if (typeof (item.value) === 'function') {
      item.type = 'function';

    } else if (Array.isArray(item.value)) {
      item.type = 'array';
      //item.title = `Array[${item.value.length}] ${JSON.stringify(item.value)}`;
      item.title = `[...]`;

    } else if (item.value === null) {
      item.type = 'null';
      item.title = 'null'

    } else if (typeof (item.value) === 'object') {
      item.type = 'object';
      //item.title = `Object ${JSON.stringify(item.value)}`;
      item.title = `{…}`

    } else if (item.value === undefined) {
      item.type = 'undefined';
      item.title = 'undefined'
    }

    item.title = this.setMaxLength('' + item.title); // defined type or 'undefined' + reduce length


    return item;
  }

  /**
   * Check item's type for Array or Object
   * @param {Item} item
   * @return {boolean}
   */
  isObject(item: Item): boolean {
    return ['object', 'array'].indexOf(item.type) !== -1;
  }

  /**
   * Handle click event on collapsable item
   * @param {Item} item
   */
  clickHandle(item: Item) {
    if (!this.isObject(item)) {
      return;
    }
    item.isOpened = !item.isOpened;
  }

  /**
   * Trims the collapsed string to the asked length
   * @param str parsed json item
   * @returns {string}
   */
  setMaxLength(str: string) {
    if (!this.maxCollapsedLength || str.length < this.maxCollapsedLength) {
      return str;
    }
    return str.substring(0, this.maxCollapsedLength) + '...';
  }
}