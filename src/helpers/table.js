import Unicon from "../components/shared/Unicon/Unicon";
import IconList from "./icons";
import moment from "moment";
import Icon from "@mui/material/Icon";

/** @return {int|string|null} The widht for the column. */
export const columnWidth = (column: FieldSpec) => {
    switch (column.prop_name) {
        case "action":
        case "order":
            return 120;

        case "name":
        case "title":
            return "*";
    }
    return null;
};

/** @return {string} The class name(s) for the column. */
export const columnClass = (column: FieldSpec) => {
    switch (column.prop_name) {
        case "order":
            return "list-page-table-align-center";
    }
    return "list-page-table-align-left";
};

/** @return {{}} The full properties for the column. */
export const columnProps = (column: FieldSpec, header: boolean = false) => {
    return {
        key: column.prop_name,
        width: columnWidth(column),
        className: (header ? "list-page-table-head" : "list-page-table-cell") + " " + columnClass(column),
        ...(column.table_props ?? {}),
    };
};

const htmlToPlainText = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
};

export const columnCell = (value, column, rowType, events) => {
    switch (rowType !== undefined ? rowType : column) {
        case "boolean":
            return value ? <Unicon icon={IconList.check} styleIcon={{ color: "#28a86e" }} /> : <Unicon icon={IconList.close} styleIcon={{ color: "#D32F2E" }} />;

        case "date_format":
            return moment(value).isValid() ? moment(value).format("DD. MMM yyyy HH:mm A") : "";

        case "image":
        case "image_button":
            return (
                <div style={{ height: "30px", width: "30px", display: "flex", alignItems: "center" }}>
                    {value ? <img src={value} style={{ objectFit: "cover", height: "30px", width: "100%" }} alt="Slika" /> : <Icon sx={{ color: "#b3b3b3" }}>no_photography</Icon>}
                </div>
            );

        case "multiple_images":
            if (column === "input") {
                const arrParsed = JSON.parse(value);
                return (
                    <div style={{ height: "30px", display: "flex", alignItems: "center" }}>
                        {arrParsed.length > 0 ? (
                            arrParsed.map((item) => {
                                return (
                                    <div key={item.id} style={{ height: "100%", width: "30px", display: "flex", alignItems: "center", marginRight: "0.3rem" }}>
                                        <img src={item.file} style={{ height: "100%", width: "100%", objectFit: "cover" }} alt="Slika" />
                                    </div>
                                );
                            })
                        ) : (
                            <Icon sx={{ color: "#b3b3b3" }}>no_photography</Icon>
                        )}
                    </div>
                );
            } else {
                return value;
            }
        case "multiple_images_one":
            if (column === "input") {
                const arrParsed = JSON.parse(value);
                return (
                    <div style={{ height: "30px", display: "flex", alignItems: "center" }}>
                        {arrParsed.length > 0 ? (
                            arrParsed.map((item) => {
                                return (
                                    <div key={item.id} style={{ height: "100%", width: "30px", display: "flex", alignItems: "center", marginRight: "0.3rem" }}>
                                        <img src={item.file + `?time=${time}`} style={{ height: "100%", width: "100%", objectFit: "cover" }} alt="Slika" />
                                    </div>
                                );
                            })
                        ) : (
                            <Icon sx={{ color: "#b3b3b3" }}>no_photography</Icon>
                        )}
                    </div>
                );
            } else {
                return value;
            }
        case "gallery":
            // varijacije tabela
            if (column === "gallery") {
                return (
                    <div style={{ height: "30px", display: "flex", alignItems: "center" }}>
                        {value.length > 0 ? (
                            value.map((item) => {
                                let time = new Date().getTime().toString();
                                let imagePath = item.file + `?time=${time}`;
                                return (
                                    <div key={item.id} style={{ height: "100%", width: "30px", marginRight: "0.3rem" }}>
                                        <img src={imagePath} style={{ height: "100%", width: "100%", objectFit: "cover" }} alt="Slika" />
                                    </div>
                                );
                            })
                        ) : (
                            <Icon sx={{ color: "#b3b3b3" }}>no_photography</Icon>
                        )}
                    </div>
                );
            } else {
                return value;
            }
        case "input":
        default:
            if (value === "Vidljiv" || value === "on" || value === "Objavljen" || value === "Aktivno" || value === "Kompletirano" || value === "Potvrđeno") {
                return <span style={{ backgroundColor: "var(--statusCompleted)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#62ad71", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Nevidljiv" || value === "off" || value === "Blokiran" || value === "Neaktivno" || value === "Otkazano") {
                return <span style={{ backgroundColor: "var(--statusCanceled)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#c35b64", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Arhiviran") {
                return <span style={{ backgroundColor: "var(--statusArchived)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#696969", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Novo" || value === "U izradi") {
                return <span style={{ backgroundColor: "var(--statusNew)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#5e9ac9", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Paket je preuzet") {
                return <span style={{ backgroundColor: "var(--statusTaken)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#766493", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Paket spreman za slanje") {
                return <span style={{ backgroundColor: "var(--statusReady)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#af8452", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Porudžbina je dostavljena") {
                return <span style={{ backgroundColor: "var(--statusDelivered)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#a3a373", fontWeight: "500" }}>{value}</span>;
            } else if (value === "Porudžbina je na čekanju") {
                return <span style={{ backgroundColor: "var(--statusPending)", padding: "0.1rem 0.7rem", borderRadius: "0.6rem", color: "#a3a373", fontWeight: "500" }}>{value}</span>;
            } else {
                if (value && /<\/?[a-z][\s\S]*>/i.test(value)) {
                    const plainText = htmlToPlainText(value);
                    return (
                        <span
                            style={{
                                overflow: "hidden",
                                lineHeight: "initial",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "3",
                                lineClamp: 3,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {plainText}
                        </span>
                    );
                } else {
                    return (
                        <span
                            style={{
                                overflow: "hidden",
                                lineHeight: "initial",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "3",
                                lineClamp: 3,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {value}
                        </span>
                    );
                }
            }
    }
};
