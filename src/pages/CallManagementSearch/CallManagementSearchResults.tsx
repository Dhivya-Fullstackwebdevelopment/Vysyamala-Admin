import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  // TablePagination, // Removed standard pagination
  TextField, // Added
  IconButton, // Added
} from "@mui/material";
import { NotifyError } from "../../common/Toast/ToastMessage";
import { callManagementSearch, callManagementSearchexport, getUsers } from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";

const CallManagementSearchResults = ({ filters, onBack }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [goToPageInput, setGoToPageInput] = useState<string>(''); // Added for custom input
  const navigate = useNavigate();
  const [exportLoading, setExportLoading] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);

  const columns = [
    // { id: "ProfileId", label: "Profile ID" },
    { id: "profile_id", label: "Profile ID" },
    { id: "particulars", label: "Particulars" },
    { id: "call_type", label: "Call Type" },
    { id: "call_comments", label: "Comments" },
    { id: "call_status", label: "Call Status" },
    { id: "call_date", label: "Call Date" },
    { id: "next_call_date", label: "Next Call Date" },
    { id: "next_action_date", label: "Next Action Date" },
    { id: "owner", label: "Owner" },
    { id: "work_assign", label: "Work Assign" },
    { id: "action_point", label: "Call Action Today" },
    { id: "next_action_point", label: "Future Action Taken" },
    { id: "profile_status", label: "Profile Status" },
    { id: "lad_call_date", label: "LAD Call Date" },
  ];

  const formatDateOnly = (value: any) => {
    if (!value) return "N/A";
    return String(value).split("T")[0];
  };

  const renderFilterHeader = () => {
    const parts: string[] = [];

    // Helper to find the username from the ID
    // Note: Ensure userList is available in your component state
    const getOwnerName = (id: string) => {
      const user = userList.find((u: any) => u.id.toString() === id);
      return user ? user.username : id;
    };

    // 1. Owner Name (Aligned to show name instead of ID)
    if (filters.commonOwnerId) {
      parts.push(`Owner - ${getOwnerName(filters.commonOwnerId)}`);
    }

    // 2. Call Dates
    if (filters.callFromDate || filters.callToDate) {
      parts.push(`Call date from ${filters.callFromDate || '...'}, to date ${filters.callToDate || '...'}`);
    }

    // 3. Action Dates
    if (filters.actionFromDate || filters.actionToDate) {
      parts.push(`Action date from ${filters.actionFromDate || '...'}, to date ${filters.actionToDate || '...'}`);
    }

    // 4. Assign Dates
    if (filters.assignDateFrom || filters.assignDateTo) {
      parts.push(`Assign date from ${filters.assignDateFrom || '...'}, to date ${filters.assignDateTo || '...'}`);
    }

    if (parts.length === 0) return null;

    return (
      <Box
        sx={{
          p: "10px 0",          // Vertical padding, 0 horizontal to align with table edge
          mb: 1,                // Small margin bottom
          textAlign: "center",    // Align text to the left
          fontWeight: "500",
          fontSize: "1rem",
          color: "#333",        // Professional dark gray color
        }}
      >
        {parts.join(" , ")}
      </Box>
    );
  };


  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();
      setUserList(data || []);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        setPage(0);

        // const parseArrayParam = (val: any) => {
        //   if (!val) return "";
        //   if (typeof val === "string") return val.split(",").map(Number);
        //   return val;
        // };

        const parseArrayParam = (val: any) => {
          if (!val) return ""; // Return empty string if no value

          // If it's already an array, just return it
          if (Array.isArray(val)) return val;

          // If it's a string (from URL), split by comma and convert to numbers
          return String(val)
            .split(",")
            .map(item => item.trim())
            .filter(item => item !== "" && !isNaN(Number(item))) // Remove empty or non-numeric items
            .map(Number); // Convert to actual numbers
        };

        const apiPayload = {
          search_value: filters.profileOrMobile || "",
          owner: filters.commonOwnerId || "",
          plan: filters.commonMode || "",
          status: filters.commonStatus || "",
          // from_date: filters.commonFromDate || "",
          // to_date: filters.commonToDate || "",
          call_from_date: filters.callFromDate || "",
          call_to_date: filters.callToDate || "",
          next_call_from_date: filters.nextCallFromDate || "",
          next_call_to_date: filters.nextCallToDate || "",
          // call_type: filters.callType || "",
          // call_status: filters.callStatus || "",
          // particulars: filters.particulars || "",

          call_type: parseArrayParam(filters.callType), // Parses "1,2" -> [1,2]
          call_status: parseArrayParam(filters.callStatus),
          particulars: parseArrayParam(filters.particulars),
          action_point: parseArrayParam(filters.actionPoints),

          call_comments: filters.callComments || "",
          action_from_date: filters.actionFromDate || "",
          action_to_date: filters.actionToDate || "",
          next_action_from_date: filters.nextActionFromDate || "",
          next_action_to_date: filters.nextActionToDate || "",
          // action_point: filters.actionPoints || "",
          //next_action: filters.nextActionComments || "",
          action_comments: filters.actionComments || "",
          next_action_comments: filters.nextActionComments || "",
          assign_from_date: filters.assignDateFrom || "",
          assign_to_date: filters.assignDateTo || "",
          assigned_by: filters.assignBy || "",
          assigned_to: filters.assignToOwner || "",
          assign_notes: filters.assignComments || "",
          latest_call_date_from: filters.latest_call_date_from || "",
          latest_call_date_to: filters.latest_call_date_to || "",
          latest_action_date_from: filters.latest_action_date_from || "",
          latest_action_date_to: filters.latest_action_date_to || "",
        };

        const response = await callManagementSearch(apiPayload);

        if (response?.status === true) {
          setData(response.profiles || []);
          setTotalItems(response.count || 0);
        } else {
          setData([]);
          setTotalItems(0);
        }
      } catch (error: any) {
        console.error(error);
        NotifyError("Failed to fetch call management search results");
      } finally {
        setLoading(false);
      }
    };

    if (filters) {
      fetchFilteredData();
    }
  }, [filters]);


  const handleExport = async () => {
    try {
      setExportLoading(true);

      const parseArrayParam = (val: any) => {
        if (!val) return ""; // Return empty string if no value

        // If it's already an array, just return it
        if (Array.isArray(val)) return val;

        // If it's a string (from URL), split by comma and convert to numbers
        return String(val)
          .split(",")
          .map(item => item.trim())
          .filter(item => item !== "" && !isNaN(Number(item))) // Remove empty or non-numeric items
          .map(Number); // Convert to actual numbers
      };

      const exportPayload = {
        search_value: filters.profileOrMobile || "",
        owner: filters.commonOwnerId || "",
        plan: filters.commonMode || "",
        status: filters.commonStatus || "",
        // from_date: filters.commonFromDate || "",
        // to_date: filters.commonToDate || "",
        call_from_date: filters.callFromDate || "",
        call_to_date: filters.callToDate || "",
        next_call_from_date: filters.nextCallFromDate || "",
        next_call_to_date: filters.nextCallToDate || "",
        // call_type: filters.callType || "",
        // call_status: filters.callStatus || "",
        // particulars: filters.particulars || "",

        call_type: parseArrayParam(filters.callType), // Parses "1,2" -> [1,2]
        call_status: parseArrayParam(filters.callStatus),
        particulars: parseArrayParam(filters.particulars),
        action_point: parseArrayParam(filters.actionPoints),

        call_comments: filters.callComments || "",
        action_from_date: filters.actionFromDate || "",
        action_to_date: filters.actionToDate || "",
        next_action_from_date: filters.nextActionFromDate || "",
        next_action_to_date: filters.nextActionToDate || "",
        // action_point: filters.actionPoints || "",
        //next_action: filters.nextActionComments || "",
        action_comments: filters.actionComments || "",
        next_action_comments: filters.nextActionComments || "",
        assign_from_date: filters.assignDateFrom || "",
        assign_to_date: filters.assignDateTo || "",
        assigned_by: filters.assignBy || "",
        assigned_to: filters.assignToOwner || "",
        assign_notes: filters.assignComments || "",
        latest_call_date_from: filters.latest_call_date_from || "",
        latest_call_date_to: filters.latest_call_date_to || "",
        latest_action_date_from: filters.latest_action_date_from || "",
        latest_action_date_to: filters.latest_action_date_to || "",
        export_type: "excel"
      };


      const response = await callManagementSearchexport(exportPayload);

      // If your API returns a file (Blob)
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Call_Management_Search_Results_${new Date().toISOString().slice(0, 10)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      } else if (response.Status === 1 && response.file_url) {
        // If your API returns a URL instead of a Blob
        window.open(response.file_url, '_blank');
      } else {
        NotifyError("Export failed or no data available.");
      }
    } catch (error) {
      console.error("Export Error:", error);
      NotifyError("An error occurred during export.");
    } finally {
      setExportLoading(false);
    }
  };

  // --- Pagination Handlers ---
  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPageInput, 10);
    if (!isNaN(pageNumber)) {
      const lastPage = Math.ceil(totalItems / rowsPerPage) - 1;
      const newPage = Math.max(0, Math.min(pageNumber - 1, lastPage));
      setPage(newPage);
      setGoToPageInput('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="contained" onClick={onBack}>
          Back to Filters
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleExport}
          disabled={exportLoading || data.length === 0}
          startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ fontWeight: 'bold' }}
        >
          {exportLoading ? 'Exporting...' : 'Export Profiles'}
        </Button>
        {/* Removed generic Typography here, it is now in the pagination bar */}
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", minHeight: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderFilterHeader()}
          <div className="mb-3 text-sm text-gray-600 font-medium">
            Showing {totalItems === 0 ? 0 : page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, totalItems)} of {totalItems} records
          </div>
          <Paper className="w-full">
            <TableContainer sx={{ border: "1px solid #E0E0E0", maxHeight: "70vh" }}>
              <Table stickyHeader sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          fontWeight: "bold",
                          color: "#ee3448",
                          background: "#FFF9C9",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.length > 0 ? (
                    data
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => (
                        <TableRow key={index} hover>
                          {columns.map((col) => (
                            <TableCell key={col.id}>
                              {/* ✅ Clickable Profile ID */}
                              {col.id === "profile_id" ? (
                                <span
                                  className="text-blue-600 cursor-pointer hover:underline"
                                  onClick={() =>
                                    window.open(`/viewProfile?profileId=${row.profile_id}`, "_blank")
                                  }
                                >
                                  {row.profile_id ?? "N/A"}
                                </span>
                              ) : ["call_date", "next_call_date", "next_action_date", "lad_call_date"].includes(col.id) ? (
                                formatDateOnly(row[col.id])
                              ) : (
                                row[col.id] ?? "N/A"
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} align="center">
                        No Records Found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

              </Table>
            </TableContainer>
          </Paper>

          {/* --- CUSTOM PAGINATION CONTROLS --- */}
          {Math.ceil(totalItems / rowsPerPage) > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600">
                {/* Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, totalItems)} of {totalItems} records */}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Typography variant="body2">Go to page:</Typography>
                  <TextField
                    size="small"
                    type="number"
                    value={goToPageInput}
                    onChange={(e) => setGoToPageInput(e.target.value)}
                    inputProps={{ min: 1, max: Math.ceil(totalItems / rowsPerPage) }}
                    style={{ width: '80px' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
                  />
                  <Button variant="contained" size="small" onClick={handleGoToPage} disabled={!goToPageInput}>
                    Go
                  </Button>
                </div>

                <IconButton onClick={() => setPage(0)} disabled={page === 0}>
                  {"<<"}
                </IconButton>
                <IconButton onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
                  {"<"}
                </IconButton>

                {/* Page Numbers Logic */}
                {(() => {
                  const totalPages = Math.ceil(totalItems / rowsPerPage);
                  const maxVisiblePages = 5;
                  let startPage, endPage;

                  if (totalPages <= maxVisiblePages) {
                    startPage = 0;
                    endPage = totalPages - 1;
                  } else {
                    const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
                    const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
                    if (page < maxPagesBeforeCurrent) {
                      startPage = 0;
                      endPage = maxVisiblePages - 1;
                    } else if (page + maxPagesAfterCurrent >= totalPages) {
                      startPage = totalPages - maxVisiblePages;
                      endPage = totalPages - 1;
                    } else {
                      startPage = page - maxPagesBeforeCurrent;
                      endPage = page + maxPagesAfterCurrent;
                    }
                  }
                  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
                    <Button
                      key={p}
                      variant={page === p ? "contained" : "text"}
                      onClick={() => setPage(p)}
                      style={{ minWidth: '32px', height: '32px', margin: '0 2px' }}
                    >
                      {p + 1}
                    </Button>
                  ));
                })()}

                <IconButton onClick={() => setPage(prev => Math.min(prev + 1, Math.ceil(totalItems / rowsPerPage) - 1))} disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}>
                  {">"}
                </IconButton>
                <IconButton onClick={() => setPage(Math.ceil(totalItems / rowsPerPage) - 1)} disabled={page >= Math.ceil(totalItems / rowsPerPage) - 1}>
                  {">>"}
                </IconButton>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CallManagementSearchResults;