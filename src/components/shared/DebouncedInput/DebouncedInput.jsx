import { useState } from "react"
import { InputInput } from "../Form/FormInputs/FormInputs"

/**
 * A text input that will trigger an onChange event only after user stops typing.
 *
 * @param {function(string)} onChange What to do when user stops typing.
 * @param {int} timeout The time to wait until we conclude the user has stopped typing, in milliseconds.
 * @param {string} value The initial value.
 * @param {{}} props Any additional properties to pass to the input.
 *
 * @return {JSX.Element}
 * @constructor
 */
const DebouncedInput = ({ onChange, timeout = 450, value, ...props }) => {
    const [ inputTimeout, setInputTimeout ] = useState(null)
    const [ localValue, setLocalValue ] = useState(value ?? "")

    // On every input change
    const inputOnChange = value => {
        setLocalValue(value)

        // Rest the timer everytime a user is active
        if (inputTimeout) {
            clearTimeout(inputTimeout)
        }

        // Schedule a cancelable onChange
        setInputTimeout(setTimeout(() => onChange && onChange(value), timeout))
    }

    return <InputInput {...props} value={localValue} onChange={event => inputOnChange(event.target.value)} margin="none" />
}

export default DebouncedInput
