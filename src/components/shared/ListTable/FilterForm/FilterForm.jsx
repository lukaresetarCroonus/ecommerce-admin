const FilterForm = ({ filterFields = [], appliedFilters, setAppliedFilters }) => {

  const handleCheckboxChange = (filterName, isChecked) => {
    setAppliedFilters({
      ...appliedFilters,
      [filterName]: isChecked,
    });
  };



  return (
    <div>
      aaaaa
      {filterFields && filterFields.length > 0 && (
        filterFields?.map((filter) => (
          <div key={filter.name}>
            <label>
              {filter.label}:
              <input
                type="checkbox"
                checked={appliedFilters?.[filter.name] || false}
                onChange={(e) => handleCheckboxChange(filter.name, e.target.checked)}
              />
            </label>
          </div>
        ))
      )}
    </div>
  );
};

export default FilterForm;

// const [sort, setSort] = useState({ field: "", direction: "" });
// const [page, setPage] = useState(1);
// const [limit, setLimit] = useState(
//   productData?.pagination?.items_per_page ?? 8
// );
// const [availableFilters, setAvailableFilters] = useState(filter);
// const [selectedFilters, setSelectedFilters] = useState([]);
// const [changeFilters, setChangeFilters] = useState(false);


// const [lastSelectedFilterKey, setLastSelectedFilterKey] = useState("");

// useEffect(() => {
//   if (changeFilters) {
//     post(`/products/category/filters/${singleCategory?.id}`, {
//       filters: tempSelectedFilters,
//     }).then((response) => {
//       const lastSelectedFilterValues = tempSelectedFilters?.find((item) => {
//         return item?.column === lastSelectedFilterKey;
//       });

//       const lastSelectedFilter = availableFilters?.find((item) => {
//         return item?.key === lastSelectedFilterKey;
//       });

//       const filterLastSelectedFromResponse = response?.payload?.filter(
//         (item) => {
//           return item?.key !== lastSelectedFilterKey;
//         }
//       );

//       const indexOfLastSelectedFilter = availableFilters?.findIndex(
//         (index) => {
//           return index?.key === lastSelectedFilterKey;
//         }
//       );

//       if (
//         lastSelectedFilter &&
//         lastSelectedFilterValues?.value?.selected?.length > 0
//       ) {
//         setAvailableFilters([
//           ...filterLastSelectedFromResponse.slice(
//             0,
//             indexOfLastSelectedFilter
//           ),
//           lastSelectedFilter,
//           ...filterLastSelectedFromResponse.slice(indexOfLastSelectedFilter),
//         ]);
//       } else {
//         setAvailableFilters(response?.payload);
//       }
//     });
//     setChangeFilters(false);
//   }
// }, [changeFilters]);


// <Filters
//   selectedFilters={selectedFilters}
//   setSelectedFilters={setSelectedFilters}
//   availableFilters={availableFilters}
//   changeFilters={changeFilters}
//   setChangeFilters={setChangeFilters}
//   setLastSelectedFilterKey={setLastSelectedFilterKey}
// />


// ///// Filters.js

// import Filter from "../Filter/Filter";
// import { useState } from "react";
// import { sortKeys } from "@/helpers/const";

// const Filters = ({
//   selectedFilters,
//   setSelectedFilters,
//   availableFilters,
//   changeFilters,
//   setChangeFilters,
//   sort,
//   setSort,
//   setLastSelectedFilterKey,
//   setOpenFilter,
// }) => {
//   const [openIndex, setOpenIndex] = useState({ key: null });
//   const [activeSort, setActiveSort] = useState({ label: "" });
//   const [sortingActive, setSortingActive] = useState(false);
//   return (
//     <>
//       <div className="h-full ">
//         <div className="flex flex-col border-b border-b-[#f5f5f5] py-[23px] overflow-hidden">
//           <div
//             className="flex flex-row justify-between cursor-pointer items-center"
//             onClick={() => setSortingActive(!sortingActive)}
//           >
//             <h1 className="text-[0.938rem] font-bold">Sortiranje</h1>
//             <div className="flex items-center cursor-pointer">
//               <p className="text-[#171717] font-bold">
//                 {sortingActive ? "-" : "+"}
//               </p>
//             </div>
//           </div>
//           <div className="overflow-hidden">
//             <div
//               className={
//                 sortingActive
//                   ? `mt-0 transition-all py-[20px] duration-[750ms] flex flex-row gap-[11px] flex-wrap`
//                   : `flex transition-all py-[20px] duration-[750ms] flex-row gap-[11px] flex-wrap -mt-52`
//               }
//             >
//               {sortKeys?.map((item, index) => {
//                 const isActive = activeSort?.label === item?.label;
//                 return (
//                   <div
//                     key={index}
//                     className={
//                       isActive && sort.field !== "" && sort.direction !== ""
//                         ? `px-3 select-none border-2 border-croonus-2 cursor-pointer py-[10px] font-medium rounded-lg bg-croonus-2 text-white`
//                         : `px-3 select-none cursor-pointer py-[10px] border-2 rounded-lg border-[#e8e8e8]`
//                     }
//                     onClick={() => {
//                       setActiveSort({
//                         label:
//                           activeSort?.label === item?.label
//                             ? null
//                             : item?.label,
//                       });
//                       setSort({
//                         field: item?.field,
//                         direction: item?.direction,
//                       });
//                       setIsBeingFiltered(true);
//                     }}
//                   >
//                     <p className="font-light text-[13px]">{item?.label}</p>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {availableFilters?.map((filter, index) => {
//           const isOpen = openIndex?.key === filter?.key;
//           return (
//             <>
//               <div
//                 className="flex cursor-pointer py-[1.375rem] select-none border-b border-b-[#f5f5f5] items-center justify-between"
//                 onClick={() =>
//                   setOpenIndex({
//                     key: openIndex?.key === filter?.key ? null : filter?.key,
//                   })
//                 }
//                 key={filter?.key}
//               >
//                 <h1 className="text-[0.938rem] font-bold">
//                   {filter?.attribute?.name}
//                 </h1>
//                 <div>
//                   <h1 className={`text-[#171717] font-bold `}>
//                     {isOpen ? `-` : `+`}
//                   </h1>
//                 </div>
//               </div>
//               <div className="overflow-hidden">
//                 <div
//                   className={
//                     isOpen
//                       ? `mt-0 translate-y-0 block h-auto py-[1rem] transition-all duration-[750ms]`
//                       : `-translate-y-full hidden py-[1rem] h-min transition-all duration-[750ms] `
//                   }
//                 >
//                   <Filter
//                     filter={filter}
//                     selectedFilters={selectedFilters}
//                     changeFilters={changeFilters}
//                     setChangeFilters={setChangeFilters}
//                     setSelectedFilters={setSelectedFilters}
//                     setLastSelectedFilterKey={setLastSelectedFilterKey}
//                   />
//                 </div>
//               </div>
//             </>
//           );
//         })}
//       </div>
//     </>
//   );
// };

// export default Filters;

// ///// Filter.js


// "use client";
// import { useState, useEffect } from "react";
// import { Slider } from "@mui/material";

// import { useRouter } from "next/navigation";
// import classes from "./Filter.module.css";
// import Link from "next/link";
// const Filter = ({
//   filter,
//   selectedFilters,
//   setSelectedFilters,
//   categoryData,
//   changeFilters,
//   setChangeFilters,
//   setLastSelectedFilterKey,
// }) => {
//   const changeHandler = (data) => {
//     let tmp = [...tempSelectedFilters];
//     const filtered = tmp.filter((item) => item.column === data.column);
//     if (data.value.selected.length === 0) {
//       if (filtered.length > 0) {
//         const index = tmp.indexOf(filtered[0]);
//         tmp.splice(index, 1);
//       }
//     } else {
//       if (filtered.length > 0) {
//         tmp = tmp.map((item) => (item.column === data.column ? data : item));
//       } else {
//         tmp.push(data);
//       }
//     }
//     setChangeFilters(true);

//     setSelectedFilters([...tmp]);
//     setLastSelectedFilterKey(data.column);

//   };

//   let selected = tempSelectedFilters.filter(
//     (item) => item.column === filter.key
//   )[0];
//   selected = selected ? selected.value.selected : [];

//   switch (filter.type) {
//     case "range":
//       return (
//         <FilterRange
//           filter={filter}
//           onChange={changeHandler}
//           selected={selected}
//         />
//       );
//     case "in":
//       return (
//         <FilterIn
//           filter={filter}
//           onChange={changeHandler}
//           selected={selected}
//         />
//       );
//     case "within_tree":
//       return <FilterWithinTree filter={filter} />;
//   }
// };

// export default Filter;

// const FilterIn = ({
//   filter,
//   onChange = () => { },
//   selected,
//   changeFilterOptions,
// }) => {
//   const [filterNumber, setFilterNumber] = useState(3);
//   const numFiltersLoaded = Math.min(filterNumber, filter?.params?.items.length);
//   const allFiltersLoaded = numFiltersLoaded === filter?.params?.items.length;
//   const handleFilterNumber = () => {
//     setFilterNumber(filterNumber + 3);
//   };
//   const checkedChanged = ({ target }) => {
//     if (target.checked) {
//       if (!selected.includes(target.value)) {
//         const tmp = [...selected, target.value];

//         onChange({
//           column: filter?.params?.use_field
//             ? filter[filter?.params?.use_field]
//             : filter.key,
//           value: { selected: tmp },
//         });
//       }
//     } else {
//       const tmp = [...selected];
//       var index = tmp.indexOf(target.value);
//       if (index !== -1) {
//         tmp.splice(index, 1);
//       }

//       onChange({
//         column: filter.key,
//         value: { selected: tmp },
//       });
//     }
//   };
//   return (
//     <>
//       {(filter?.params?.items ?? []).map((item) => (
//         <>
//           <div
//             key={item.id}
//             className="mt-2 flex flex-row items-center gap-2 pl-4 text-[0.775rem]"
//           >
//             <input
//               type="checkbox"
//               className="h-4 w-4 rounded-sm bg-croonus-1  text-croonus-3 focus:ring-0"
//               name={item.label}
//               checked={selected.includes(
//                 filter?.params?.use_field
//                   ? item[filter?.params?.use_field]
//                   : item.key
//               )}
//               onChange={checkedChanged}
//               value={
//                 filter?.params?.use_field
//                   ? item[filter?.params?.use_field]
//                   : item.key
//               }
//               id={"chbx-" + item.id}
//             />
//             <label
//               className="text-[0.875rem] leading-[1.625rem]"
//               htmlFor={"chbx-" + item.id}
//             >
//               {item.label}
//             </label>
//           </div>
//         </>
//       ))}
//     </>
//   );
// };

// const FilterRange = ({ filter, onChange, selected }) => {
//   const [selectedValue, setSelectedValue] = useState(
//     selected.length === 2
//       ? selected
//       : [Number(filter.params.min), Number(filter.params.max)]
//   );
//   const onRangeChange = (data, value) => {
//     onChange({
//       column: filter?.params?.use_field
//         ? filter[filter?.params?.use_field]
//         : filter.key,
//       value: { selected: value },
//     });
//   };

//   useEffect(() => {
//     if (selected.length !== 2)
//       setSelectedValue([Number(filter.params.min), Number(filter.params.max)]);
//   }, [selected, filter.params]);

//   return (
//     <>
//       <div className={`mt-5 w-[85%] mx-auto`}>
//         <Slider
//           sx={{
//             width: "100%",
//             "& .MuiSlider-thumb": {
//               color: "black",
//             },
//             "& .MuiSlider-track": {
//               color: "black",
//             },
//             "& .MuiSlider-rail": {
//               color: "black",
//             },
//             "& .MuiSlider-active": {
//               color: "black",
//             },
//           }}
//           value={selectedValue}
//           onChange={(e) => {
//             setSelectedValue(e.target.value);
//           }}
//           onChangeCommitted={onRangeChange}
//           valueLabelDisplay="auto"
//           min={Number(filter.params.min)}
//           max={Number(filter.params.max)}
//         />
//       </div>
//       <div className={`${classes.valueHolder} max-md:text-center`}>
//         <span>od: {selectedValue[0]}</span>
//         <span> do: {selectedValue[1]}</span>
//       </div>
//     </>
//   );
// };

// const FilterWithinTree = ({ filter }) => {
//   const router = useRouter();

//   return (
//     <>
//       {(filter?.params?.items ?? []).map((item) => (
//         <>
//           <div
//             key={item.id}
//             className="mt-2 flex flex-row items-center gap-2 pl-4 text-[0.775rem]"
//           >
//             <Link
//               className="text-[0.875rem] leading-[1.625rem]"
//               htmlFor={"chbx-" + item.id}
//               href={`/kategorije/${item?.slug}`}
//             >
//               {item.label}
//             </Link>
//           </div>
//         </>
//       ))}
//     </>
//   );
// };


