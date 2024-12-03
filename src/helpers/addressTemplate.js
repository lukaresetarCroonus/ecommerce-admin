const addressTemplate = (address, object_number, floor, apartmentNumber, zipCode, townName, countryName) => {
    return `${address ?? ""} ${object_number ?? ""} ${floor ?? ""} ${apartmentNumber ?? ""}, ${zipCode ?? ""} ${townName ?? ""} ${countryName ?? ""}`;
};

export default addressTemplate;
