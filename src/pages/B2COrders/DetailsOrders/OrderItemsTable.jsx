import { Link } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { currencyFormat } from "../../../helpers/functions";

import styles from "./B2COrdersDetails.module.scss";
import Icon from "@mui/material/Icon";

const OrderItemsTable = ({ items, fields }) => {
  const getField = (type, value) => {
    switch (type) {
      case "image":
        return (
          <div style={{ height: "40px", width: "30px" }}>
            {value ? <img src={value} style={{ objectFit: "cover", height: "100%", width: "100%" }} alt="Slika" /> : <Icon sx={{ color: "#b3b3b3" }}>no_photography</Icon>}
          </div>
        );
      case "currency":
        return currencyFormat(value);
      default:
        return value;
    }
  };


  return (
    <Table sx={{ width: "100%" }}>
      <TableHead>
        <TableRow>
          {fields.map((field, index) => {
            return (
              <TableCell
                className={styles.tableHeadCell}
                key={field.prop_name}
                sx={{
                  padding: index === 0 ? "0.3rem 0.8rem 0.3rem 0" : "0.3rem 0.8rem",
                }}
              >
                {field.field_name}
              </TableCell>
            )
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((item) => {
          return (
            <TableRow key={item.item.id}>
              {fields.map((field, index) => {
                let value = null;
                if (item.item != null && item.item.hasOwnProperty(field.prop_name)) {
                  value = item.item[field.prop_name];
                } else if (item.price != null && item.price.hasOwnProperty(field.prop_name)) {
                  value = item.price[field.prop_name];
                } else {
                  value = null;
                }

                const specificFieldWidth = "25%";
                const totalSpecificFieldsWidth = specificFieldWidth * 2;
                const totalWidthWithoutSpecificFields = (100 - totalSpecificFieldsWidth) / (fields.length - 2);

                return (
                  <TableCell
                    key={field.prop_name}
                    className={styles.productCell}
                    sx={{
                      padding: index === 0 ? "0.8rem 0.8rem 0.8rem 0" : "0.8rem",
                    }}
                    width={field.prop_name === "name" || field.prop_name === "sku" ? specificFieldWidth : `${totalWidthWithoutSpecificFields}%`}
                  >
                    <Link to={`/products/${item.item.id_product}`} className={styles.productCellLink}>
                      {field.prop_name === "total_discount_amount" ? "-" : null}
                      {getField(field.input_type, value)}
                      {field.prop_name === "name" && item.item.attributes_text ? (
                        <span style={{ fontWeight: "400", fontSize: "0.75rem", marginLeft: "0.2rem" }}>
                          ({item.item.attributes_text})
                        </span>
                      ) : null}
                    </Link>
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table >
  );
};

export default OrderItemsTable;
