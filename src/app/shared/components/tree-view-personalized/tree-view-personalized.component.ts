import { Component, Input, Output, EventEmitter, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { TreeviewI18n, TreeviewItem, TreeviewConfig, DropdownTreeviewComponent, TreeviewHelper } from 'ngx-treeview';
import { TreeviewPersonalizedI18n } from './tree-view-i18';
import { isNil } from 'lodash';
import { TreeViewPersonalized } from 'src/app/shared/components/tree-view-personalized/entities/treeview-personalized';


@Component({
  selector: 'app-tree-view-personalized',
  templateUrl: './tree-view-personalized.component.html',
  providers: [
    { provide: TreeviewI18n, useClass: TreeviewPersonalizedI18n }
  ]
})
export class TreeViewPersonalizedComponent implements OnChanges {

  @Input() config: TreeviewConfig;
  @Input() items: TreeviewItem[];
  @Input() value: any;
  @Output() valueChange = new EventEmitter<any>();
  @ViewChild(DropdownTreeviewComponent) dropdownTreeviewComponent: DropdownTreeviewComponent;
  @Input() clearSelect: Boolean = false;
  filterText: string;
  private dropdownTreeviewSelectI18n: TreeviewPersonalizedI18n;

  constructor(
    public i18n: TreeviewI18n
  ) {
    this.config = TreeviewConfig.create({
      hasAllCheckBox: false,
      hasCollapseExpand: false,
      hasFilter: true,
      maxHeight: 500
  });
  this.dropdownTreeviewSelectI18n = i18n as TreeviewPersonalizedI18n;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (isNil(this.value)) {
      this.selectAll();
    } else {
      this.updateSelectedItem();
    }
  }

  select(item: TreeviewItem) {
    this.selectItem(item);
  }

  private updateSelectedItem() {
    if (!isNil(this.items)) {
      if (this.value instanceof TreeViewPersonalized) {
        this.value = this.value.value;
      }
      let selectedItem = TreeviewHelper.findItemInList(this.items, this.value);
      if (selectedItem) {
        if (this.clearSelect) {
          selectedItem.checked = false;
          selectedItem = undefined;
        }
        this.selectItem(selectedItem);
      } else {
        this.selectAll();
      }
    }
  }

  private selectItem(item: TreeviewItem) {
    this.dropdownTreeviewComponent.dropdownDirective.close();
    if (this.dropdownTreeviewSelectI18n.selectedItem !== item) {
      this.dropdownTreeviewSelectI18n.selectedItem = item;
      if (item && this.value !== item.value) {
          this.value = item.value;
          // this.unCkeckedItemNotSelected();
      } else {
        this.value = undefined;
      }
    }
    this.valueChange.emit(item);
  }

  private selectAll() {
    const allItem = undefined;
    this.selectItem(allItem);
  }

  private unCkeckedItemNotSelected() {
    this.items.forEach(element => {
      if (element.value !== this.value) {
        element.checked = false;
      }

      if (element.children && element.children.length > 0) {
        element.children.forEach(elementChild => {
          if (elementChild.value !== this.value) {
            elementChild.checked = false;
          }
        });
      }
    });
  }

}
