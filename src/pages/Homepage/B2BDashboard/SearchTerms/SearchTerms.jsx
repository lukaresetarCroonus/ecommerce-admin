import { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";

import Card from "../../../../components/shared/Card/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AuthContext from "../../../../store/auth-contex";
import SearchTermsLatest from "./SearchTermsLatest";
import SearchTermsTop from "./SearchTermsTop";
import Skeleton from "@mui/material/Skeleton";

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

const SearchTerms = () => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const searchTermsLatest = "admin/dashboard/b2b/product-item-search-terms-latest";
  const searchTermsTop = "admin/dashboard/b2b/product-item-search-terms-top";

  const [value, setValue] = useState(0);

  const { data: sTermsLatest, isLoading: isLoadingStermsLatest } = useQuery(["searchTermsLatest"], () => api.get(`${searchTermsLatest}`).then((response) => response?.payload));
  const { data: sTermsTop, isLoading: isLoadingStermsTop } = useQuery(["searchTermsTop"], () => api.get(`${searchTermsTop}`).then((response) => response?.payload));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const overrides = {
    color: " var(--third-color)",
    border: "none",
    borderRadius: "0.25rem",
    minHeight: "0",
    fontSize: "0.8rem",
    "&.Mui-selected": { backgroundColor: "var(--theme)", color: "var(--white)" },
  };


  const tabsToShow = [
    { label: "Poslednje", condition: 1 },
    { label: "Najtraženije", condition: 2 },
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
        styleCard={{ display: "flex", flexDirection: "column", gridColumn: "3/-1", boxShadow: "none", "@media (max-width: 1200px)": { gridColumn: "1/-1" } }}
        children={
          <>
            <CardHeader
              title={<Typography variant="h6" sx={{ color: "var(--text-color)", backgroundColor: "var(--main-bg-color)", padding: "0.5rem 1rem", borderRadius: "0.4rem", lineHeight: "1", fontSize: "1rem" }}>Pretraga</Typography>}
            />
            <CardContent>
              <Box sx={{ width: "100%" }}>
                <Box>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{ style: { display: "none" } }} >
                    {tabsToShow.map((tab, index) => {
                      if (tab.condition) {
                        return (
                          <Tab
                            key={index}
                            label={tab.label}
                            {...a11yProps(index)}
                            // className={styles.tab}
                            sx={overrides}
                          />
                        );
                      }
                      return null;
                    })}
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  {isLoadingStermsLatest ? (
                    <>
                      <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                      <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                      <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                    </>
                  ) : (
                    sTermsLatest?.length > 0 ? <SearchTermsLatest sTermsLatest={sTermsLatest} /> : <Typography variant="body2" sx={{ color: "var(--text-color)", fontSize: "0.875rem", marginTop: "2rem" }}>Trenutno nema podataka za prikaz.</Typography>
                  )}

                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  {isLoadingStermsTop ? (
                    <>
                      <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                      <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                      <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                    </>
                  ) : (
                    sTermsTop?.length > 0 ? <SearchTermsTop sTermsTop={sTermsTop} /> : <Typography variant="body2" sx={{ color: "var(--text-color)", fontSize: "0.875rem", marginTop: "2rem" }}>Trenutno nema podataka za prikaz.</Typography>
                  )}
                </CustomTabPanel>
              </Box>
            </CardContent>
          </>
        }
      />
    </>
  )
}

export default SearchTerms