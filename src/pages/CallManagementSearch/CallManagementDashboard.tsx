import React, { useState } from "react";
import CallManagementSearchFilters from "../CallManagementSearch/CallManagementFilters";
import CallManagementSearchResults from "../CallManagementSearch/CallManagementSearchResults";

const CallManagementDashboard = () => {
  const [showResults, setShowResults] = useState(false);
  const [filterData, setFilterData] = useState<any>(null);

  const handleFilterSubmit = (filters: any) => {
    setFilterData(filters);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  return (
    <div>
      {!showResults ? (
        <CallManagementSearchFilters onFilterSubmit={handleFilterSubmit} loading={false} />
      ) : (
        <CallManagementSearchResults filters={filterData} onBack={handleBack} />
      )}
    </div>
  );
};

export default CallManagementDashboard;
