import React from "react";
import { Table, TableContainer, TableBody, TableRow, TableCell, Paper } from "@mui/material";

const FeedbackTable = ({ feedbackData } : any) => {
  return (
    <TableContainer component={Paper} style={{ maxHeight: "400px", overflowY: "auto" }}>
      <Table>
        <TableBody>
          {feedbackData.map((feedback : any, index : any) => (
            <TableRow key={index}>
              <TableCell>{index}</TableCell>
              <TableCell>{feedback}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};


export default FeedbackTable;
