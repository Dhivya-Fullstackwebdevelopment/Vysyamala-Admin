// import React, { useState } from "react";
// import CallManagementSearchFilters from "../CallManagementSearch/CallManagementFilters";
// import CallManagementSearchResults from "../CallManagementSearch/CallManagementSearchResults";

// const CallManagementDashboard = () => {
//   const [showResults, setShowResults] = useState(false);
//   const [filterData, setFilterData] = useState<any>(null);

//   const handleFilterSubmit = (filters: any) => {
//     setFilterData(filters);
//     setShowResults(true);
//   };

//   const handleBack = () => {
//     setShowResults(false);
//   };

//   return (
//     <div>
//       {!showResults ? (
//         <CallManagementSearchFilters onFilterSubmit={handleFilterSubmit} loading={false} />
//       ) : (
//         <CallManagementSearchResults filters={filterData} onBack={handleBack} />
//       )}
//     </div>
//   );
// };

// export default CallManagementDashboard;

import React from "react";
import { useSearchParams } from "react-router-dom";
import CallManagementSearchFilters from "../CallManagementSearch/CallManagementFilters";
import CallManagementSearchResults from "../CallManagementSearch/CallManagementSearchResults";

const CallManagementDashboard = () => {
  const [searchParams] = useSearchParams();
  
  // Check if "view=results" is in the URL to decide which component to show
  const isResultsView = searchParams.get("view") === "results";

  const handleFilterSubmit = (filters: any) => {
    // 1. Prepare parameters. Add a 'view' flag so the new tab knows to show results.
    const params = new URLSearchParams();
    params.append("view", "results");

    // 2. Map all filter values to query params
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== "" && value !== null && value !== undefined) {
        // If it's an array (like callType), join with commas
        if (Array.isArray(value)) {
          if (value.length > 0) params.append(key, value.join(","));
        } else {
          params.append(key, value);
        }
      }
    });

    // 3. Open the current path with the new query string in a new tab
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.open(newUrl, "_blank");
  };

  const handleBack = () => {
    // Since it's a new tab, "Back" could either close the tab or clear params
    window.close(); 
    // Or: window.location.search = ""; 
  };

  return (
    <div>
      {!isResultsView ? (
        <CallManagementSearchFilters onFilterSubmit={handleFilterSubmit} loading={false} />
      ) : (
        // Convert searchParams back to a plain object for the Results component
        <CallManagementSearchResults 
            filters={Object.fromEntries(searchParams.entries())} 
            onBack={handleBack} 
        />
      )}
    </div>
  );
};

export default CallManagementDashboard;
