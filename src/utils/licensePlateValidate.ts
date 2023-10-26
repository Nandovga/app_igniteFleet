const LICENSE_PLATE_REGEX = '[A-Z]{3}[0-9][0-9A-Z][0-9]'

export function licensePlateValidate(licensePlate: string){
    const license = licensePlate.toUpperCase();
    return license.match(LICENSE_PLATE_REGEX);
}
