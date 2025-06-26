import { TreeviewI18nDefault, TreeviewItem, TreeviewSelection } from 'ngx-treeview';
import { Injectable } from '@angular/core';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';

@Injectable()
export class TreeviewPersonalizedI18n extends TreeviewI18nDefault {

    constructor(
        private translationService: TranslationService) {
        super();
    }
    private internalSelectedItem: TreeviewItem;

    set selectedItem(value: TreeviewItem) {
        this.internalSelectedItem = value;
    }

    get selectedItem(): TreeviewItem {
        return this.internalSelectedItem;
    }

    getText(selection: TreeviewSelection): string {
        if (this.internalSelectedItem) {
            return this.internalSelectedItem.text;
        } else {
            if (2 === this.translationService.getLanguageId()) {
                return 'Selecciona asunto';
            } else {
                return 'Select subject';
            }
        }
    }

    getFilterPlaceholder(): string {
        if (2 === this.translationService.getLanguageId()) {
            return 'Buscar asunto';
        } else {
            return 'Search subject';
        }
    }

    getAllCheckboxText(): string {
        if (2 === this.translationService.getLanguageId()) {
            return 'Selecciona asunto';
        } else {
            return 'Select subject';
        }
    }
}
