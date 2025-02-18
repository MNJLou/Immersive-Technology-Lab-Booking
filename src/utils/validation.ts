/**
 * Validates the student number, ensuring it is in the format u12345678
 * @param studentNumber
 */
export const validateStudentNumber = (studentNumber: string) => {
    const regex = /^[uU]\d+$/;
       if (!regex.test(studentNumber)) {
            return "Student number must be in the format u12345678";
       } else if (studentNumber.length !== 9) {
            return "Student number must be 'u' followed by 8 digits";
       }
    return "";
}

/**
 * Validate the name, ensuring it only contains letters and hyphens
 * @param name
 */
export const validateName = (name: string) => {
    const regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (name.length < 1) {
        return "required";
    }
    if (!regex.test(name)) {
        return "may only contain letters and hyphens";
    }
    return "";
}

/**
 * Validate the email, ensuring it is in the format name@email.com
 * @param email
 * @returns
 */
export const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email.length < 1) {
        return "required";
    }
    if (!regex.test(email)) {
        return "Email is invalid";
    }
    return "";
}

/**
 * Validate the year of study, ensuring it is between 1960 and the current year
 * @param yearOfStudy
*/
export const validateYearOfStudy = (yearOfStudy: number) => {
    const currentYear = new Date().getFullYear();
    if (yearOfStudy < 1960 || yearOfStudy > currentYear) {
        return "Year of study is invalid";
    }
    return "";
}

/**
 * Validate the degree, ensuring it is in the format Degree abbriviation followed by the full degree name
 * @param degree
 */
export const validateDegree = (degree: string) => {
    // format is Degree abbriviation (upper or lowercase) followed by a space and then the full degree name
    const regex = /^[a-zA-Z]{2,} [a-zA-Z ]{2,}$/;
    if (degree.length < 1) {
        return "required";
    }
    if (!regex.test(degree)) {
        return "Degree abbreviation followed by the full degree name e.g. BSc Computer Science";
    }
    return "";
}

/**
 * Format the degree to have the first letter of each word capitalized
 * @param degree
 */
export const formatDegree = (degree: string) => {
    const newDegree = degree.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return newDegree;
}



