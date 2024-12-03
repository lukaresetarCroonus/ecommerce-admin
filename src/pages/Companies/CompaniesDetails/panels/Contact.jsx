import ListPage from "../../../../components/shared/ListPage/ListPage";
import formFields from "../forms/contact.json"

const ListPanel = ({ companyId }) => {

  return <ListPage listPageId="CompaniesDetailsContact" apiUrl={`admin/customers-b2b/contact/${companyId}`} editUrl={`admin/customers-b2b/contact`} deleteUrl={`admin/customers-b2b/contact`} initialData={{ id_company: companyId }} columnFields={formFields} actionNewButton="modal" addFieldLabel="Dodajte kontakt" showAddButton={true} title=" " />;
};

export default ListPanel;
