// import { useState } from 'react';
// // import SearchProfileResults from './CommonSearchTableAndFilter/SearchProfileResults';
// // import SearchProfileFilters from './CommonSearchTableAndFilter/SearchProfileFilters';
// import No_Image_Available from '../images/No_Image_Available .jpg';
// import SearchProfileFilters from './CommonSearchTableAndFilter/SearchProfileFilters';
// import SearchProfileResults from './CommonSearchTableAndFilter/SearchProfileResults'; 

// const SearchProfile = () => {
//   const [showResults, setShowResults] = useState(false);
//   const [filters, setFilters] = useState<any>(null);
//   const [loading, setLoading] = useState(false);

//   const handleFilterSubmit = (filterData: any) => {
//     setFilters(filterData);
//     setShowResults(true);
//   };

//   const handleBackToFilters = () => {
//     setShowResults(false);
//     setFilters(null);
//   };

//   return (
//     <div>
//       {!showResults ? (
//         <SearchProfileFilters onFilterSubmit={handleFilterSubmit} loading={loading} />
//       ) : (
//         <SearchProfileResults filters={filters} onBack={handleBackToFilters} No_Image_Available={No_Image_Available} />

//       )}
//     </div>
//   );
// };

// export default SearchProfile;



import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import SearchProfileFilters from './CommonSearchTableAndFilter/SearchProfileFilters';
import SearchProfileResults from './CommonSearchTableAndFilter/SearchProfileResults'; 
import No_Image_Available from '../images/No_Image_Available .jpg';

const SearchProfile = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // 1. Logic: Decide based on the URL parameter 'view'
  const isResultsView = searchParams.get('view') === 'results';

  // State for loading (if handled here)
  const [loading, setLoading] = useState(false);

  return (
    <div>
      {isResultsView ? (
        /* If URL has ?view=results, show the Table */
        <SearchProfileResults 
          filters={{}} // Results will be read from URL inside SearchProfileResults
          onBack={() => window.close()} // Since it's a new tab, "back" could close it
          No_Image_Available={No_Image_Available} 
        />
      ) : (
        /* Otherwise, show the Filter form */
        <SearchProfileFilters 
          onFilterSubmit={() => {}} // Submission logic is handled inside the form via window.open
          loading={loading} 
        />
      )}
    </div>
  );
};

export default SearchProfile;