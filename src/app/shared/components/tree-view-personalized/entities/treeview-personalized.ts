import { TreeviewItem } from 'ngx-treeview';
import { TreeItemPersonalized } from './treeview-item-personalized.dto';
export class TreeViewPersonalized extends TreeviewItem {
    public message: string;
    public subjectReference: string;
    constructor(item: TreeItemPersonalized) {
       super(item, false);
       this.message = item.message;
       this.subjectReference = item.subjectReference;
    }
}
