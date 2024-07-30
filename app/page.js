"use client";
import React, { useState } from "react";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  AppBar,
  Toolbar,
  Typography,
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
  InputBase,
  alpha,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddClick = () => {
    if (newItem.trim() !== "") {
      if(editIndex!==null)
        {
          const updatedItems = items.map((item,index) =>
          editIndex!==index ? item:newItem
          );
          setItems(updatedItems);
          setEditIndex(null);
        }
        else{
      setItems([...items, newItem]);
        }
      setNewItem("");
    }
  };

  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };

  const handleDeleteClick = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setNewItem(items[index]);

  }

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#7C73C0" }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            <img
              src="/logo.png" // Replace with your logo URL
              alt="Logo"
              style={{ marginRight: "10px", width: "110px", height: "40px" }}
            />
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>

      <Box
        height="100vh"
        width="100vw"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor=""
      >
        <Box height="500px" width="700px" bgcolor="" padding={2} overflow="auto">
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                id="outlined-basic"
                label="enter item name"
                variant="outlined"
                value={newItem}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth onClick={handleAddClick}  sx={{bgcolor:"#7C73C0","&:hover": {
      bgcolor: "#7C73C0",}}}>
                {editIndex!==null ? "Update":"Add"}
              </Button>
            </Grid>
          </Grid>

          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant='h5'>Pantry Item</Typography></TableCell>
                  <TableCell align="center"><Typography variant='h5'>Edit</Typography></TableCell>
                  <TableCell align="center"><Typography variant='h5'>Delete</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item,index) => (
                  <TableRow key={index}>
                    
                    <TableCell component="th" scope="row"><Typography variant = "h6">{item}</Typography>
                      
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEditClick(index)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton sx={{ color: "red" }} onClick={() => handleDeleteClick(index)}>
                      <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
