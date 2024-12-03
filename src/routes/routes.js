import IconList from "../helpers/icons";
import B2BRebatesDetails from "../pages/B2BRebates/B2BRebatesDetails/B2BRebatesDetails";
import B2BRebatesListPage from "../pages/B2BRebates/B2BRebatesListPage";
import B2BRebateTiersListPage from "../pages/B2BRebateTiers/B2BRebateTiersListPage";
import Countries from "../pages/Countries/Countries";
import PricesGroupsListPage from "../pages/PricesGroups/PricesGroupsListPage";
import Towns from "../pages/Towns/Towns";
import Streets from "../pages/Streets/Streets";
import Brands from "../pages/Brands/Brands";
import Stores from "../pages/Stores/Stores";
import Municipalities from "../pages/Municipalities/Municipalities";
import Manufacturers from "../pages/Manufacturers/Manufacturers";
import ProductDetails from "../pages/Products/ProductDetails/ProductDetails";
import ProductGroupDetails from "../pages/ProductSpecs/ProductGroupDetails/ProductGroupDetails";
import ProductsPriceMarkets from "../pages/ProductsPriceMarkets/ProductsPriceMarkets";
import ProductSpecsGroups from "../pages/ProductSpecs/ProductSpecsGroups";
import EOffer from "../pages/EOffer/EOffer";
// import ProductVariantsAttributes from "../pages/ProductVariantsAttributes/ProductVariantsAttributeDetails/ProductVariantsAttributeDetails";
import ProductVariantsAttributesDetails from "../pages/ProductVariantsAttributes/ProductVariantsAttributeDetails/ProductVariantsAttributeDetails";
import AdminForm from "../pages/AdminForm/AdminForm";
import AdminFormDetails from "../pages/AdminForm/AdminFormDetails/AdminFormDetails";
import B2CNews from "./../pages/B2CNews/B2CNews";
import B2CNewsDetails from "../pages/B2CNews/B2CNewsDetails/B2CNewsDetails";
import B2CNewsCategoryList from "./../pages/B2CNewsCategoryList/B2CNewsCategoryList";
import B2CNewsCategoryListDetails from "./../pages/B2CNewsCategoryList/B2CNewsCategoryListDetails/B2CNewsCategoryListDetails";
import B2Bbanners from "./../pages/B2Bbanners/B2Bbanners";
import B2CStaticPages from "../pages/B2CStaticPages/B2CStaticPages";
import B2CStaticPagesDetails from "../pages/B2CStaticPages/B2CStaticPagesDetails/B2CStaticPagesDetails";
import B2CLandingPages from "../pages/B2CLandingPages/B2CLandingPages";
import B2CLandingPagesDetails from "../pages/B2CLandingPages/B2CLandingPagesDetails/B2CLandingPagesDetails";
import B2CCustomers from "../pages/B2CCustomers/B2CCustomers";
import B2CCustomersDetails from "../pages/B2CCustomers/B2CCustomersDetails/B2CCustomersDetails";
import Promotions from "../pages/Promotions/Promotions";
import Newsletter from "../pages/Newsletter/Newsletter";
import B2CContactForm from "../pages/B2CContactForm/B2CContactForm";
import AdminSettings from "./../pages/AdminSettings/AdminSettings";
import B2Bsettings from "./../pages/B2Bsettings/B2Bsettings";
import B2Cbanners from "./../pages/B2Cbanners/B2Cbanners";
import B2CSettings from "./../pages/B2CSettings/B2CSettings";
import Import from "../pages/Import/Import";
import ImportDetails from "../pages/Import/ImportDetails/ImportDetails";
import DetailsParams from "./../pages/Params/DetailsParams/DetailsParams";
import Params from "./../pages/Params/Params";
import Products from "./../pages/Products/Products";
import CategoriesGroupsListPage from "../pages/Categories/CategoriesGroupsListPage";
import CategoriesDetails from "../pages/Categories/CategoriesDetails/CategoriesDetails";
import Notifications from "../pages/Notifications/Notifications";
import { makeScreen, MenuGroup } from "./utils";
import CategoriesListPage from "../pages/Categories/CategoriesList/CategoriseListPage";
import CategoriesTree from "../pages/Categories/CategoriesTree/CategoriesTree";
import Companies from "../pages/Companies/Companies";
import CompaniesDetails from "../pages/Companies/CompaniesDetails/CompaniesDetails";
import SaleOfficers from "../pages/SaleOfficers/SaleOfficers";
import B2BbannersPositions from "../pages/B2BbannersPositions/B2BbannersPositions";
import B2CbannersPositions from "../pages/B2CbannersPositions/B2CbannersPositions";
import B2BOrders from "../pages/B2BOrders/B2BOrders";
import B2BOrdersDetails from "../pages/B2BOrders/Details/B2BOrdersDetails";
import RolesListPage from "../pages/Roles/RolesListPage";
import RolesDetailsPage from "../pages/Roles/RolesDetails/RolesDetailsPage";
import Users from "../pages/Users/Users";
import AdminSettingsDetails from "../pages/AdminSettings/SettingsDetails/AdminSettingsDetails";
import B2BSettingsDetails from "../pages/B2Bsettings/SettingsDetails/B2BSettingsDetails";
import B2CSettingsDetails from "../pages/B2CSettings/SettingsDetails/B2CSettingsDetails";
import B2BContactForm from "../pages/B2BContactForm/B2BContactForm";
import B2COrders from "../pages/B2COrders/B2COrders";
import B2COrdersDetails from "../pages/B2COrders/DetailsOrders/B2COrdersDetails";
import B2CEmployees from "../pages/B2CEmployees/B2CEmployees";
import Scripts from "../pages/Scripts/Scripts";
import B2CContactFormDetails from "../pages/B2CContactForm/B2CContacFormDetails/B2CContactFormDetails";
import Homepage from "../pages/Homepage/Homepage";
import Error404 from "../pages/Error/Error404";
import B2BContactFormDetails from "../pages/B2BContactForm/DetailsContactForm/B2BContactFormDetails";
import B2CWorkingUnit from "../pages/B2CWorkingUnit/B2CWorkingUnit";
import B2CCareer from "../pages/B2CCareer/B2CCareer";
import Export from "../pages/Export/Export";
import ExportDetails from "../pages/Export/ExportDetails/ExportDetails";
import B2BStaticPages from "../pages/B2BStaticPages/B2BStaticPages";
import B2BStaticPagesDetails from "../pages/B2BStaticPages/B2BStaticPagesDetails/B2BStaticPagesDetails";
import B2BLandingPages from "../pages/B2BLandingPages/B2BLandingPages";
import B2BLandingPagesDetails from "../pages/B2BLandingPages/B2BLandingPagesDetails/B2BLandingPagesDetails";
import PromotionsCatalogCampaignsPageDetails from "../pages/Promotions/PromotionsCatalogCampaigns/PromotionsCatalogCampaignsPageDetails/PromotionsCatalogCampaignsPageDetails";
import PromotionsCartSummaryDetails from "../pages/Promotions/PromotionsCartSummary/PromotionsCartSummaryDetails/PromotionsCartSummaryDetails";
import PromotionsDeliveryCampaignsDetails from "../pages/Promotions/PromotionsDeliveryCampaigns/PromotionsDeliveryCampaignsDetails/PromotionsDeliveryCampaignsDetails";
import PromotionsRecommendedDetails from "../pages/Promotions/PromotionsRecommended/PromotionsRecommendedDetails/PromotionsRecommendedDetails";
import PromotionsCrossSellsDetails from "../pages/Promotions/PromotionsCrossSells/PromotionsCrossSellsDetails/PromotionsCrossSellsDetails";
import PromotionsUpSellsDetails from "../pages/Promotions/PromotionsUpSells/PromotionsUpSellsDetails/PromotionsUpSellsDetails";
import B2BReclamations from "../pages/B2BReclamations/B2BReclamations";
import B2BReclamationsDetails from "../pages/B2BReclamations/B2BReclamationsDetails/B2BReclamationsDetails";
import EOfferDetails from "../pages/EOffer/EOfferDetails/EOfferDetails";
import PromoCodes from "../pages/Promotions/PromoCodes/PromoCodes";
import PromoCodesDetails from "../pages/Promotions/PromoCodes/PromoCodesDetails/PromoCodesDetails";
import Codes from "../pages/Promotions/PromoCodes/PromoCodesDetails/Codes/Codes";
import { Reports } from "../pages/Reports/reports";
import PromotionReports from "../pages/PromotionsReports/PromotionReports";
// import B2CReclamations from "../pages/B2CReclamations/B2CReclamations";
// import B2CReclamationsDetails from "../pages/B2CReclamations/B2CReclamationsDetails/B2CReclamationsDetails";

/** The list of available screens. */
const { PRODUCT, SALE, B2B, B2C, COMPANY_SETTINGS, SETTINGS, REPORTS } = MenuGroup;
const screens = {
    HOMEPAGE: ["/homepage", "", "", "", Homepage],
    ERROR404: ["*", "", "", "", Error404, []],
    REPORTS_PRODUCTS: ["/reports/products", "Izveštaji", IconList.inventory, REPORTS, Reports, []],
    REPORTS_CAMPAIGNS: ["/reports/promotions", "Promocije", IconList.celebration, REPORTS, PromotionReports, []],
    B2C_ORDERS: ["/b2c-orders", "Porudžbine", IconList.fileOpen, SALE, B2COrders, [[":orderId", B2COrdersDetails]]],
    B2B_ORDERS: ["/b2b-orders", "Porudžbine", IconList.fileOpen, SALE, B2BOrders, [[":orderId", B2BOrdersDetails]]],
    BANNERS_B2C: ["/b2c-banners", "Baneri", IconList.image, SALE, B2Cbanners, [["positions", B2CbannersPositions]]],
    BANNERS_B2B: ["/b2b-banners", "Baneri", IconList.image, SALE, B2Bbanners, [["positions", B2BbannersPositions]]],
    B2C_LANDING_PAGES: ["/b2c-landingpages", "Promo strane", IconList.autoStories, SALE, B2CLandingPages, [[":lid", B2CLandingPagesDetails]]],
    B2B_LANDING_PAGES: ["/b2b-landingpages", "Promo strane", IconList.autoStories, SALE, B2BLandingPages, [[":lid", B2BLandingPagesDetails]]],
    PROMOTIONS: ["/promotions", "Promocije", IconList.celebration, SALE, Promotions, [["promotions-catalog-campaigns/:nid", PromotionsCatalogCampaignsPageDetails]]],
    PROMOTIONS: [
        "/promotions",
        "Promocije",
        IconList.celebration,
        SALE,
        Promotions,
        [
            ["promotions-catalog-campaigns/:nid", PromotionsCatalogCampaignsPageDetails],
            ["promotions-cart-summary-campaigns/:nid", PromotionsCartSummaryDetails],
            ["promotions-delivery-campaigns/:nid", PromotionsDeliveryCampaignsDetails],
            ["promotions-recommended/:rid", PromotionsRecommendedDetails],
            ["promotions-cross-sells/:rid", PromotionsCrossSellsDetails],
            ["promotions-up-sells/:rid", PromotionsUpSellsDetails],
            ["promo-codes/:pid", PromoCodesDetails],
            ["promo-codes/:pId/new", Codes],
        ],
    ],
    CATEG: [
        "/product-categories",
        "Kategorije",
        IconList.category,
        PRODUCT,
        CategoriesGroupsListPage,
        [
            ["tree/:gid", CategoriesTree],
            ["category/:gid", CategoriesListPage],
            ["category/:gid/:cid", CategoriesDetails],
        ],
    ],
    PRODU: [
        "/products",
        "Proizvodi",
        IconList.inventory,
        PRODUCT,
        Products,
        [
            [":prodId", ProductDetails],
            ["prices-groups", PricesGroupsListPage],
            ["price-markets", ProductsPriceMarkets],
            ["product-items-variants-attributes/group-attribute", ProductVariantsAttributesDetails],
            ["product-specs/groups", ProductSpecsGroups],
            ["product-specs/groups/:groupId", ProductGroupDetails],
        ],
    ],
    //PRODUCT_SPEC: ["/product-specs/groups", "Specifikacija", IconList.inventory, PRODUCT, ProductSpecsGroups, [[":groupId", ProductGroupDetails]]],
    IMPORT: ["/import", "Uvoz podataka", IconList.download, PRODUCT, Import, [[":upId", ImportDetails]]],
    EXPORT: ["/export", "Izvoz podataka", IconList.upload, PRODUCT, Export, [[":exId", ExportDetails]]],
    EPONUDA: ["/eponuda", "E-ponuda", IconList.inventory, PRODUCT, EOffer, [["details", EOfferDetails]]],
    COMPN: ["/b2b-companies", "Kompanije", IconList.locationCity, B2B, Companies, [[":comId", CompaniesDetails]]],
    REBATE_TIERS: ["/b2b-rebate-tiers", "Rabatne skale", IconList.barChart, B2B, B2BRebateTiersListPage],
    REBATES: ["/b2b-rebates", "Rabati", IconList.percent, B2B, B2BRebatesListPage, [[":rebateId", B2BRebatesDetails]]],
    B2B_SALES_OFFICER: ["/b2b-sales-officers", "Komercijalisti", IconList.manageAccounts, B2B, SaleOfficers],
    B2B_NOTIFICATIONS: ["/b2b-notifications", "Notifikacije", IconList.notifications, B2B, Notifications],
    B2B_CONTACT_FORMS: ["/b2b-contact", "Kontakt forma", IconList.markunreadMailbox, B2B, B2BContactForm, [[":id", B2BContactFormDetails]]],
    B2B_STATIC_PAGES: ["/b2b-staticpages", "Statičke strane", IconList.autoStories, B2B, B2BStaticPages, [[":spid", B2BStaticPagesDetails]]],
    RECLAMATIONS_B2B: ["/b2b-reclamations", "Reklamacije", IconList.receiptLong, B2B, B2BReclamations, [[":rid", B2BReclamationsDetails]]],

    B2C_NEWS: [
        "/b2c-news",
        "Vesti",
        IconList.newspaper,
        B2C,
        B2CNews,
        [
            [":nid", B2CNewsDetails],
            ["category", B2CNewsCategoryList],
            ["category/:cid", B2CNewsCategoryListDetails],
        ],
    ],
    B2C_STATIC_PAGES: ["/b2c-staticpages", "Statičke strane", IconList.autoStories, B2C, B2CStaticPages, [[":spid", B2CStaticPagesDetails]]],
    B2C_CUSTOMERS: ["/b2c-customers", "Kupci", IconList.group, B2C, B2CCustomers, [[":cid", B2CCustomersDetails]]],
    B2C_NEWSLETTER: ["/b2c-newsletter", "Newsletter", IconList.notificationsActive, B2C, Newsletter, [[":nlid", Newsletter]]],
    B2C_CONTACT_FORMS: ["/b2c-contactform", "Kontakt forma", IconList.markunreadMailbox, B2C, B2CContactForm, [[":id", B2CContactFormDetails]]],
    B2C_EMPLOYEES: ["/b2c-employees", "Zaposleni", IconList.badge, B2C, B2CEmployees],
    B2C_WORKING_UNITS: ["/b2c-working-unit", "Radne jedinice", IconList.engineering, B2C, B2CWorkingUnit],
    B2C_CAREER: ["/b2c-career", "Karijera", IconList.notes, B2C, B2CCareer],
    // RECLAMATIONS_B2C: ["/b2c-reclamations", "Reklamacije", IconList.receiptLong, B2C, B2CReclamations, [[":rid", B2CReclamationsDetails]]],

    ROLES: ["/roles", "Uloge", IconList.reduceCapacity, COMPANY_SETTINGS, RolesListPage, [[":roleId", RolesDetailsPage]]],
    USERS: ["/users", "Korisnici", IconList.group, COMPANY_SETTINGS, Users],

    COUNTRIES: ["/countries", "Države", IconList.flag, COMPANY_SETTINGS, Countries],
    MUNICIPALITIES: ["/municipalities", "Opštine", IconList.locationCity, COMPANY_SETTINGS, Municipalities],
    TOWNS: ["/towns", "Mesta", IconList.apartment, COMPANY_SETTINGS, Towns],
    STREETS: ["/streets", "Ulice", IconList.addRoad, COMPANY_SETTINGS, Streets],
    BRANDS: ["/brands", "Brendovi", IconList.copyright, COMPANY_SETTINGS, Brands],
    STORES: ["/stores", "Skladišta", IconList.store, COMPANY_SETTINGS, Stores],
    MANUFACTURERS: ["/manufacturers", "Proizvođači", IconList.factory, COMPANY_SETTINGS, Manufacturers],

    ADMINCFG: ["/admin-settings", "Admin podešavanja", IconList.settings, SETTINGS, AdminSettings, [[":AdminId", AdminSettingsDetails]]],
    B2BCFG: ["/b2b-settings", "B2B podešavanja", IconList.settings, SETTINGS, B2Bsettings, [[":B2BId", B2BSettingsDetails]]],
    B2CCFG: ["/b2c-settings", "B2C podešavanja", IconList.settings, SETTINGS, B2CSettings, [[":B2CId", B2CSettingsDetails]]],
    ADMIN_SCRIPTS: ["/scripts", "Skripte", IconList.description, SETTINGS, Scripts],
    ADMIN_FORM: ["/admin-form", "Admin forme", IconList.list, SETTINGS, AdminForm, [[":formId", AdminFormDetails]]],
    PARAMS: ["/params", "Parametri", IconList.settings, SETTINGS, Params, [[":pid", DetailsParams]]],
};

/**
 * Builds the screens from the configuration above.
 *
 * @typedef AvailableScreen
 *    @property {string} name
 *    @property {string} path
 *    @property {JSX.Element} icon
 *    @property {string} group
 *    @property {JSX.Element} component
 *    @property {AvailableScreen[]} children
 */
export const availableScreens: AvailableScreen[] = {};
for (const code in screens) {
    availableScreens[code] = makeScreen(screens[code]);
}
