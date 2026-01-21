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
  TablePagination, // 1. Import TablePagination
} from "@mui/material";
import { NotifyError } from "../../common/Toast/ToastMessage";
import { callManagementSearch } from "../../api/apiConfig";

const CallManagementSearchResults = ({ filters, onBack }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);

  // 2. Add Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const columns = [
    { id: "ProfileId", label: "Profile ID" },
    { id: "particulars", label: "Particulars" },
    { id: "call_type", label: "Call Type" },
    { id: "call_comments", label: "Comments" },
    { id: "call_status", label: "Call Status" },
    { id: "call_date", label: "Date" },
    { id: "next_call_date", label: "Next Call Date" },
    { id: "next_action_point", label: "Next Date - Action Point" },
    { id: "owner", label: "Owner" },
    { id: "work_assign", label: "Work Assign" },
    { id: "call_action_today", label: "Call Action Today" },
    { id: "future_action_taken", label: "Future Action Taken" },
    { id: "profile_status", label: "Profile Status" },
    { id: "lad_call_date", label: "LAD Call Date" },
  ];

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setLoading(true);
        // Reset page to 0 when new filter is applied
        setPage(0);

        const apiPayload = {
          search_value: filters.profileOrMobile || "",
          owner: filters.commonOwnerId || "",
          plan: filters.commonMode || "",
          status: filters.commonStatus || "",
          from_date: filters.commonFromDate || "",
          to_date: filters.commonToDate || "",
          call_from_date: filters.callFromDate || "",
          call_to_date: filters.callToDate || "",
          next_call_from_date: filters.nextCallFromDate || "",
          next_call_to_date: filters.nextCallToDate || "",
          call_type: filters.callType || "",
          call_status: filters.callStatus || "",
          particulars: filters.particulars || "",
          call_comments: filters.callComments || "",
          action_from_date: filters.actionFromDate || "",
          action_to_date: filters.actionToDate || "",
          next_action_from_date: filters.nextActionFromDate || "",
          next_action_to_date: filters.nextActionToDate || "",
          action_point: filters.actionPoints || "",
          next_action: filters.nextActionComments || "",
          action_comments: filters.actionComments || "",
          next_action_comments: filters.nextActionComments || "",
          assign_from_date: filters.assignDateFrom || "",
          assign_to_date: filters.assignDateTo || "",
          assigned_by: filters.assignBy || "",
          assigned_to: filters.assignToOwner || "",
          assign_notes: filters.assignComments || "",
        };

        const response = await callManagementSearch(apiPayload);

        if (response?.status === true) {
          setData(response.profiles || []);
          setTotalItems(response.count || 0); // Or response.profiles.length
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

  // 3. Handle Pagination Events
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <Button variant="contained" onClick={onBack}>
          Back to Filters
        </Button>

        <Typography variant="h6" fontWeight="bold">
          Total Records: {totalItems}
        </Typography>
      </div>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", minHeight: "300px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper className="w-full">
          <TableContainer sx={{ border: "1px solid #E0E0E0", maxHeight: "70vh" }}> {/* Added maxHeight for sticky header effect */}
            <Table stickyHeader sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        fontWeight: "bold",
                        color: "#ee3448",
                        background: "#FFF9C9", // Moved background here for stickyHeader compatibility
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.length > 0 ? (
                  // 4. Slice the data so we only render 10-25 rows at a time
                  data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index} hover> {/* Added hover for better UI */}
                        {columns.map((col) => (
                          <TableCell key={col.id}>
                            {row[col.id] ?? "N/A"}
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
          
          {/* 5. Add the Pagination Component */}
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}
    </div>
  );
};

export default CallManagementSearchResults;