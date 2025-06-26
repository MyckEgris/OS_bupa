/**
* FileHelper.ts
*
* @description: This class helps to file upload controls
* @author Juan Camilo Moreno.
* @author Yefry Lopez.
* @version 1.0
* @date 13-10-2018.
*
**/
export class FileHelper {

    /**
     * Constant for bytes sufix
     */
    private static BYTES_SUFIX = 'b';

    /**
     * Constant for kilobytes sufix
     */
    private static KILOBYTE_SUFIX = 'kb';

    /**
     * Constant for megabytes sufix
     */
    private static MEGABYTE_SUFIX = 'mb';

    /**
     * Constant for kilobyte value in bytes
     */
    private static KILOBYTE_VALUE = 1024;

    /**
     * Constant for megabytes value in bytes
     */
    private static MEGABYTE_VALUE = 1048576;

    /**
    * This function allows calculate the size of a upload file.
    * @param file file to calculate size.
    */
    public static calculateFileSize(file: File) {
        const size = file.size;
        return this.calculateSizeSufix(size);
    }

    public static calculateSizeSufix(size) {
        let sufix = this.BYTES_SUFIX;
        if (this.checksIfFileSizeIsBeetween1KbAnd1024Kb(size)) {
            size = size / this.KILOBYTE_VALUE;
            sufix = this.KILOBYTE_SUFIX;
        } else if (this.checksIfFileSizeIsGreaterThan1024Kb(size)) {
            size = size / this.MEGABYTE_VALUE;
            sufix = this.MEGABYTE_SUFIX;
        }
        return `${Math.round(size)} ${sufix}`;
    }

    /**
     * Checks if a file to upload is between 1 kilobyte and 1 megabyte
     * @param size Size of a file
     */
    private static checksIfFileSizeIsBeetween1KbAnd1024Kb(size) {
        return (size >= this.KILOBYTE_VALUE && size < this.MEGABYTE_VALUE);
    }

    /**
     * Checks if a file to upload is greater than 1 megabyte
     * @param size Size of a file
     */
    private static checksIfFileSizeIsGreaterThan1024Kb(size) {
        return (size >= this.MEGABYTE_VALUE);
    }
}
