import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AdvanceSearchFilters from './AdvanceSearchFilters';
import CommonSearchResults from './CommonSearchResults';
import No_Image_Available from '../../../src/images/No_Image_Available .jpg';

const AdvanceSearchDashboard = () => {
    const [searchParams] = useSearchParams();

    // If "view=results" is in the URL, we are in results mode
    const isResultsView = searchParams.get("view") === "results";

    const handleFilterSubmit = (filters: any) => {
        const params = new URLSearchParams();
        params.append("view", "results");

        // Convert the filter object into Query Parameters
        Object.keys(filters).forEach((key) => {
            const value = filters[key];
            if (value !== "" && value !== null && value !== undefined) {
                params.append(key, value);
            }
        });

        // Open the current path with query params in a new tab
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.open(newUrl, "_blank");
    };

    const handleBack = () => {
        // Since it's a new tab, "Back" can just close the tab
        window.close();
    };

    return (
        <div>
            {!isResultsView ? (
                <AdvanceSearchFilters
                    onFilterSubmit={handleFilterSubmit}
                    loading={false}
                />
            ) : (
                <CommonSearchResults
                    // Convert URL params back to a plain object for the component
                    filters={Object.fromEntries(searchParams.entries())}
                    onBack={handleBack}
                    No_Image_Available={No_Image_Available}
                />
            )}
        </div>
    );
};

export default AdvanceSearchDashboard;