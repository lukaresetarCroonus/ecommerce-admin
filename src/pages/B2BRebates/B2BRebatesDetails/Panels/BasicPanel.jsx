import Form from "../../../../components/shared/Form/Form"
import fields from "../../tblFields.json"

/**
 * Form that allows user to edit basic info.
 *
 * @param {{}} data The data to initially populate the form with.
 * @param {function({})} updateData Update the data.
 *
 * @return {JSX.Element}
 * @constructor
 */
const BasicPanel = ({ data, updateData }) => (
  <Form
    initialData={data}
    formFields={fields}
    cancelButton={false}
    onSubmit={updateData} />
)

export default BasicPanel
