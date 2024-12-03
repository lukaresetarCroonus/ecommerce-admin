import { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";

import OrderAmountChart from "./OrderAmountChart"
import OrderCountChart from "./OrderCountChart"
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AuthContext from "../../../../store/auth-contex";
import { InputSelect } from "../../../../components/shared/Form/FormInputs/FormInputs";
import Card from "../../../../components/shared/Card/Card";
import CardContent from "@mui/material/CardContent";
import ProductItemSellCount from "./ProductItemSellCount";

const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box component={"div"} sx={{ overflowX: "auto" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ChartTabs = () => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const orderCountChart = "admin/dashboard/b2b/order-count-chart";
  const orderAmountChart = "admin/dashboard/b2b/order-amount-chart";
  const productItemSellCountChart = "admin/dashboard/b2b/product-item-sell-count-chart";

  const [value, setValue] = useState(0);
  const [periodOrderCountChart, setPeriodOrderCountChart] = useState('last_7_days');
  const [periodOrderAmountChart, setPeriodOrderAmountChart] = useState('last_7_days');
  const [periodItemSellChart, setPeriodItemSellChart] = useState('last_7_days');
  let periodOrderCountChartUrl = 'last_7_days';
  let periodOrderAmountChartUrl = 'last_7_days';
  let periodItemSellChartUrl = 'last_7_days';

  const { data: countChart, isLoading: isLoadingOrderCountChart, refetch: refetchOrderCountChart } = useQuery(["orderCountChart"], () => api.get(`${orderCountChart}?period=${periodOrderCountChartUrl}`).then((response) => response?.payload));
  const { data: amountChart, isLoading: isLoadingOrderAmountChart, refetch: refetchOrderAmountChart } = useQuery(["orderAmountChart"], () => api.get(`${orderAmountChart}?period=${periodOrderAmountChartUrl}`).then((response) => response?.payload));
  const { data: itemSellChart, isLoading: isLoadingItemSellChart, refetch: refetchItemSellChart } = useQuery(["productItemSellCountChart"], () => api.get(`${productItemSellCountChart}?period=${periodItemSellChartUrl}`).then((response) => response?.payload));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const overrides = {
    color: " var(--text-color)",
    border: "none",
    borderRadius: "0.25rem",
    fontSize: "0.8rem",
    minHeight: "0",
    "&.Mui-selected": { backgroundColor: "var(--theme)", color: "var(--white)" },
  };

  const handleChangePeriodOrderCountChart = (res) => {
    setPeriodOrderCountChart(res.target.value);
    periodOrderCountChartUrl = res.target.value;
    refetchOrderCountChart();
  }

  const handleChangePeriodOrderAmountChart = (res) => {
    setPeriodOrderAmountChart(res.target.value);
    periodOrderAmountChartUrl = res.target.value;
    refetchOrderAmountChart();
  }

  const handleChangePeriodItemSellChart = (res) => {
    setPeriodItemSellChart(res.target.value);
    periodItemSellChartUrl = res.target.value;
    refetchItemSellChart();
  }

  const tabsToShow = [
    { label: "Broj kupovina", condition: 2 },
    { label: "Iznos kupovina", condition: 1 },
    { label: "Broj prodatih proizvoda", condition: 3 },
  ];

  useEffect(() => {
    const index = tabsToShow.findIndex((value) => value.value);
    if (index !== -1 && value !== index) {
      setValue(index);
    }
  }, []);

  return (
    <>
      <Card
        styleCard={{ gridColumn: "1/3", boxShadow: "none", "@media (max-width: 1200px)": { gridColumn: "1/-1" } }}
        children={
          <>
            <CardContent>
              <Box>
                <Box>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{ style: { display: "none" } }} >
                    {tabsToShow.map((tab, index) => {
                      if (tab.condition) {
                        return (
                          <Tab
                            key={index}
                            label={tab.label}
                            {...a11yProps(index)}
                            sx={overrides}
                          />
                        );
                      }
                      return null;
                    })}
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <InputSelect
                    styleFormControl={{ width: "35%", ".MuiFormLabel-root": { fontSize: "0.875rem" } }}
                    label={"Izaberite period prikaza"}
                    usePropName={false}
                    fillFromApi={false}
                    options={[
                      {
                        id: 'last_24_hours',
                        name: 'Poslednjih 24 časa'
                      },
                      {
                        id: 'last_7_days',
                        name: 'Poslednjih 7 dana'
                      },
                      {
                        id: 'current_month',
                        name: 'Tekući mesec'
                      },
                      {
                        id: 'last_12_months',
                        name: 'Poslednjih 12 meseci'
                      }
                    ]}
                    value={periodOrderCountChart}
                    onChange={(res) => handleChangePeriodOrderCountChart(res)}
                  />
                  <OrderCountChart countChart={countChart} isLoadingOrderCountChart={isLoadingOrderCountChart} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <InputSelect
                    styleFormControl={{ width: "35%", ".MuiFormLabel-root": { fontSize: "0.875rem" } }}
                    label={"Izaberite period prikaza"}
                    usePropName={false}
                    fillFromApi={false}
                    options={[
                      {
                        id: 'last_24_hours',
                        name: 'Poslednjih 24 časa'
                      },
                      {
                        id: 'last_7_days',
                        name: 'Poslednjih 7 dana'
                      },
                      {
                        id: 'current_month',
                        name: 'Tekući mesec'
                      },
                      {
                        id: 'last_12_months',
                        name: 'Poslednjih 12 meseci'
                      }
                    ]}
                    value={periodOrderAmountChart}
                    onChange={(res) => handleChangePeriodOrderAmountChart(res)}
                  />
                  <OrderAmountChart amountChart={amountChart} isLoadingOrderAmountChart={isLoadingOrderAmountChart} />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                  <InputSelect
                    styleFormControl={{ width: "35%", ".MuiFormLabel-root": { fontSize: "0.875rem" } }}
                    label={"Izaberite period prikaza"}
                    usePropName={false}
                    fillFromApi={false}
                    options={[
                      {
                        id: 'last_24_hours',
                        name: 'Poslednjih 24 časa'
                      },
                      {
                        id: 'last_7_days',
                        name: 'Poslednjih 7 dana'
                      },
                      {
                        id: 'current_month',
                        name: 'Tekući mesec'
                      },
                      {
                        id: 'last_12_months',
                        name: 'Poslednjih 12 meseci'
                      }
                    ]}
                    value={periodItemSellChart}
                    onChange={(res) => handleChangePeriodItemSellChart(res)}
                  />
                  <ProductItemSellCount itemSellChart={itemSellChart} isLoadingItemSellChart={isLoadingItemSellChart} />
                </CustomTabPanel>
              </Box>
            </CardContent>
          </>
        }
      />

    </>
  )
}

export default ChartTabs