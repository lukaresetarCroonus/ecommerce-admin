import SearchableListForm from "../../../../components/shared/Form/SearchableListForm/SearchableListForm";

/**
 * Choose which categories are assigned to a rebate.
 *
 * @return {JSX.Element}
 * @constructor
 */
const CategoriesPanel = ({ rebate, categories, onUpdate }) => <SearchableListForm available={categories} selected={rebate.categories} onSubmit={onUpdate} selectAll={true} />;

export default CategoriesPanel;
