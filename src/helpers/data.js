/**
 * Convert file blob to data.
 *
 * @param {Blob} file The original file.
 * @return {Promise<string>} File converted to Data URL.
 */
export const blobToData = (file: Blob) =>
    new Promise(resolve => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(file)
    })

/**
 * Rotate a two-dimensional matrix by 90 degrees by swapping the first and the second indices between each other.
 *
 * @param {[][]} originalMatrix The two-dimensional matrix to rotate.
 *
 * @return {[][]} The rotated matrix.
 */
export function rotateMatrix(originalMatrix) {
    const rotatedMatrix = []

    // Go over the first dimension
    for (const key1 in originalMatrix) {
        if (originalMatrix.hasOwnProperty(key1)) {

            // Go over the second dimension
            for (const key2 in originalMatrix[key1]) {
                if (originalMatrix[key1].hasOwnProperty(key2)) {
                    rotatedMatrix[key2] = rotatedMatrix[key2] ?? []

                    // Create a copy with the swapped indices
                    rotatedMatrix[key2][key1] = originalMatrix[key1][key2]
                }
            }
        }
    }

    return rotatedMatrix
}

/**
 * Remove an item from an array.
 *
 * @param {*[]} arr The array to remove an item from.
 * @param {int} index The index to remove.
 *
 * @return {*[]} The array with the removed item on the supplied index.
 */
export const removeAtIndex = (arr, index) => {
    const splicedArray = [ ...arr ]
    splicedArray.splice(index, 1)
    return splicedArray
}

/**
 * Update a state.
 *
 *  @param {function()} setter The state setter to use for update.
 * @param {{}} values The values to update.
 *
 * @return {function(*): *}
 */
export const updateState = (setter, values: {}) =>
    setter((existing) => ({ ...existing, ...values }))

/**
 * Update a state.
 *
 *  @param {function()} setter The state setter to use for update.
 *  @param {string} key The key in the existing state to replace or add.
 * @param {*} value The value to set for a key.
 *
 * @return {function(*): *}
 */
export const updateStateKey = (setter, key: string, value: {}) =>
    updateState(setter, { [key]: value })

/**
 * Take an array of object and create pairs.
 *
 * @param {{}[]} source The array of objects to use as source.
 *
 * @param {string} key The key used to the key in new pairs
 * @param {string} value The key withing the source to use for the value of the pairs.
 */
export const createPairs = (source: {}[], key: string, value: string): { string: * } =>
    source.reduce((pairs, item) => ({ ...pairs, [item[key]]: item[value] }), {})
