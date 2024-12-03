import SearchableListForm from "../../../../components/shared/Form/SearchableListForm/SearchableListForm"

/**
 * Choose which brands are assigned to a rebate.
 *
 * @return {JSX.Element}
 * @constructor
 */
const BrandsPanel = ({ rebate, brands, onUpdate }) =>
    <SearchableListForm available={brands} selected={rebate.brands} onSubmit={onUpdate} />

export default BrandsPanel
