/**
 * Extract from custom array value by wanted key.
 *
 * @param  {Object} item
 * @param  {string} key  Use dot notation for deep key structure in nested objects. Example: items.item.id
 * @return {*} The extracted value or null if the key is not found.
 */
function extractDataFromArray(item, key) {
    let result = null;

    const keys = key.split(".");

    let temp = item;
    for (let i = 0; i < keys.length; i++) {
        const t_key = keys[i];
        if (temp && t_key in temp) {
            if (i === keys.length - 1) {
                result = temp[t_key];
            } else {
                temp = temp[t_key];
            }
        } else {
            break;
        }
    }

    return result;
}

/**
 * Make text from template and send data.
 * Template can do deep look for data. Example: template = '{stores.basic_data.name} ({additional})';
 *
 * @param {string} template
 * @param {Object} data
 * @return {Object} An object containing the template, result, replace_data, and generate_data.
 */
export function connectTemplateFields(template, data) {
    const matches = [...template.matchAll(/\{([^\}]+)\}/g)];

    const replaceKeys = {};
    if (matches && Array.isArray(matches)) {
        matches.forEach((match) => {
            replaceKeys[match[0]] = match[1] || match[0];
        });
    }

    const replaceData = {};
    const generateData = {};
    for (const [replaceKey, replaceValue] of Object.entries(replaceKeys)) {
        const value = extractDataFromArray(data, replaceValue); // Assuming extractDataFromArray is defined
        replaceData[replaceKey] = value;
        generateData[replaceValue] = value;
    }

    return {
        template: template,
        result: template.replace(new RegExp(Object.keys(replaceData).join("|"), "g"), (matched) => replaceData[matched]),
        replace_data: replaceData,
        generate_data: generateData,
    };
}
