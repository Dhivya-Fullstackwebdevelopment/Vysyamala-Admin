import React, { useState } from 'react';
import AdvanceSearchFilters from './AdvanceSearchFilters'; // Your existing form component
import CommonSearchResults from './CommonSearchResults';   // The modified results component (see Step 3)
import No_Image_Available from '../../../src/images/No_Image_Available .jpg';

const AdvanceSearchDashboard = () => {
    const [showResults, setShowResults] = useState(false);
    const [filterData, setFilterData] = useState<any>(null);

    // This function receives the data from the Filter Form
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
                <AdvanceSearchFilters
                    onFilterSubmit={handleFilterSubmit}
                    loading={false}
                />
            ) : (
                <CommonSearchResults
                    filters={filterData}
                    onBack={handleBack}
                    No_Image_Available={No_Image_Available}
                />
            )}
        </div>
    );
};

export default AdvanceSearchDashboard;