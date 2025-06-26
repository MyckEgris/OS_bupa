import { SubjectDto } from '../entities/subject.dto';
import { TreeviewItem } from 'ngx-treeview';
import { TreeViewPersonalized } from '../../../components/tree-view-personalized/entities/treeview-personalized';
import { SubjectsByLanguajeDto } from '../entities/subjects-by-languaje.dto';
import { ListSubjectDto } from '../entities/list-subject.dto';
import { InquiryResponseDto } from '../entities/inquiry-response.dto';
import { InquirySpeciality } from 'src/app/inquiry/information-request/information-request-wizard/entities/inquirySpeciality';


/***
 * Helper created to perform generic functions in the CRM consultation process
 */
export class InquiryHelper {

    /****
     * Function that transform one list of Subject in
     * one list interpreted for treeViewComponent
     *
     * @param listSubject List to transform  Subject[]
     * @param lang Languaje for return the data
     * @returns list to transformed in TreeViewPersonalized[]
     */
    public static mappedSubjectToTreeview(listSubject: ListSubjectDto, lang: number) {
        const listReturn: TreeViewPersonalized[] = [];

        listSubject.subjectsInformation.forEach(subject => {

            const subjectsByLanguaje: SubjectsByLanguajeDto =
                subject.subjectsByLanguage.filter(i => Number(i.subjectLanguageId) === lang)[0];

            const parent = new TreeViewPersonalized({
                text: subjectsByLanguaje.subjectTitle,
                value: subject.subjectId,
                message: subjectsByLanguaje.subjectMessage,
                subjectReference: subject.subjectReference,
                collapsed: true,
                checked: false
            });

            if (subject.subjectInformationSons.length > 0) {
                const listChildren: TreeviewItem[] = [];
                subject.subjectInformationSons.forEach((child: SubjectDto) => {
                    const childByLanguaje: SubjectsByLanguajeDto =
                        child.subjectsByLanguage.filter(i => Number(i.subjectLanguageId) === lang)[0];
                    const children = new TreeViewPersonalized({
                        text: childByLanguaje.subjectTitle,
                        value: child.subjectId,
                        message: childByLanguaje.subjectMessage,
                        subjectReference: subject.subjectReference,
                        checked: false,
                        collapsed: true
                    });
                    listChildren.push(children);
                });
                parent.children = listChildren;
            }
            listReturn.push(parent);
        });
        return listReturn;
    }

    /***
     * Get Subject From Treeview for to save Inquiry
     * @param treeView Object interpreted for treeViewComponent
     * @returns SubjectDto Object with only idSubject and SubjectRefernce
     */
    public static getSubjectFromTreeview(treeView: TreeViewPersonalized): SubjectDto {
        const subject: SubjectDto = {
            subjectId: treeView.value,
            isEnabled: true,
            orderPriority: null,
            subjectInformationSons: [],
            subjectReference: treeView.subjectReference,
            subjectsByLanguage: []
        };
        return subject;
    }

    /***
     * Get Subject Reference by Languaje
     */
    public static getSubjectTraslate(data: InquiryResponseDto, lang: number) {
        data.data.forEach(
            inquiry => {
                if (inquiry.subject) {
                    const subjectsByLanguaje: SubjectsByLanguajeDto =
                        inquiry.subject.subjectsByLanguage.filter(i => Number(i.subjectLanguageId) === lang)[0];
                    inquiry.subject.subjectReference = subjectsByLanguaje.subjectTitle;
                }
            }
        );
        data.data = data.data.sort((inquiry1, inquiry2) =>
                (inquiry1.subject.subjectReference > inquiry2.subject.subjectReference) ? 1 : -1);
    }

    /***
     * Get Tree View Traslate.
     */
    public static getTreeViewTraslate(listSubject: ListSubjectDto, subject: TreeViewPersonalized, lang: number) {
        listSubject.subjectsInformation.some(s => {
            if (s.subjectId === subject.value) {
                const subjectByLanguaje: SubjectsByLanguajeDto =
                    s.subjectsByLanguage.filter(l => Number(l.subjectLanguageId) === lang)[0];
                subject.text = subjectByLanguaje.subjectTitle;
                subject.message = subjectByLanguaje.subjectMessage;
                return s.subjectId === subject.value;
            } else if (s.subjectInformationSons.length > 0) {
                const subjectSon = s.subjectInformationSons.filter(a => a.subjectId === subject.value)[0];
                const subjectByLanguaje: SubjectsByLanguajeDto =
                    subjectSon.subjectsByLanguage.filter(l => Number(l.subjectLanguageId) === lang)[0];
                subject.text = subjectByLanguaje.subjectTitle;
                subject.message = subjectByLanguaje.subjectMessage;
                return subjectSon !== undefined && subject !== null;
            }
        });
    }

}
