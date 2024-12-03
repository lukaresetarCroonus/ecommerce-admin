export const priceValidate = (data, field) => {
    let ret = data;
    switch (field) {
        case "price_single_with_out_vat":
        case "price_vat_procent":
        case "price_quantity":
            ret.price_with_out_vat = Math.round(ret.price_quantity * ret.price_single_with_out_vat * 100) / 100;
            ret.price_with_vat = Math.round((ret.price_vat_procent / 100 + 1) * ret.price_with_out_vat * 100) / 100;
            return ret;
        case "price_with_out_vat":
            ret.price_with_vat = Math.round((ret.price_vat_procent / 100 + 1) * ret.price_with_out_vat * 100) / 100;
            ret.price_single_with_out_vat = Math.round((ret.price_with_out_vat / ret.price_quantity) * 100) / 100;
            return ret;
        case "price_with_vat":
            ret.price_with_out_vat = Math.round((ret.price_with_vat / (ret.price_vat_procent / 100 + 1)) * 100) / 100;
            ret.price_single_with_out_vat = Math.round((ret.price_with_out_vat / ret.price_quantity) * 100) / 100;
            return ret;
        default:
            return ret;
    }
};
