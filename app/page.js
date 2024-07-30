"use client";
import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  TableBody,
  Table,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TableContainer,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Home() {
  const [items, addItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const handleAddClick = () => {
    if (newItem.trim() !== "") {
      addItems([...items, newItem]);
      setNewItem("");
    }
  };
  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };

  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor=""
    >
      <Box height="500px" width="500px" bgcolor="" padding={2} overflow="auto">
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              id="outlined-basic"
              label="Outlined"
              variant="outlined"
              value={newItem}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button variant="contained" fullWidth onClick={handleAddClick}>
              Add
            </Button>
          </Grid>
        </Grid>

        <TableContainer component={Paper} style={{ marginTop: 20 }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Pantry Item</TableCell>
                <TableCell align="center">Edit</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item}>
                  <TableCell component="th" scope="row">
                    {item}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton sx={{ color: "red" }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
