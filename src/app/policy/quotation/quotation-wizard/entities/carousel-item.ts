/**
* CarouselItem
*
* @description: This class order items in carousel items
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class order items in carousel items
 */
export interface CarouselItem {
    /**
     * Id
     */
    id: number;

    /**
     * Plans
     */
    plans: Array<any>;

    /**
     * Selected
     */
    selected: number;
}
