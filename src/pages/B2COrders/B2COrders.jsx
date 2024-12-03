import { useContext, useEffect, useState } from "react";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2COrders = () => {

  const useWindowWide = (size) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      }

      window.addEventListener("resize", handleResize);

      handleResize();

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, [setWidth]);

    return width > size;
  };

  // const wide = useWindowWide(768);

  const customActions = {
    edit: {
      type: "custom",
      display: false,
    },
    // delete: {
    //   display: wide,
    // }
    delete: {
      type: "delete",
      display: false,
    },
  };

  return (
    <ListPage
      listPageId="B2COrders"
      apiUrl="admin/orders-b2c/list"
      title="Narudžbenice"
      columnFields={tblFields}
      showNewButton={false}
      customActions={customActions}
    />
  );
};

export default B2COrders;
