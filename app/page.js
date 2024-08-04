"use client";
import React, { useEffect, useState } from "react";
import { db } from './firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Button,
  TableBody,
  TextField,
  Table,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  TableContainer,
  Paper,
  InputBase,
  alpha,
  Modal,
  Card,
  CircularProgress,
  CardContent
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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  
  // API related state
  const [response, setResponse] = useState('');
  const [itemnames, setItemNames] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    const names = items.map(item => item.name);
    const itemNamesString = names.join(', ');

    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: `Give me two recipes using these ingredients: ${itemNamesString}. Please provide clear instructions and list all ingredients.`
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);
      if (data.choices && data.choices.length > 0) {
        setResponse(data.choices[0].message.content);
      } else {
        setResponse("No recipes found.");
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse(`Error: ${error.message}`);
    }
    finally{
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    const records = await getDocs(collection(db, 'inventory'));
    const itemList = records.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    console.log(itemList);
    setItems(itemList);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpen = (index = null) => {
    if (index !== null) {
      setNewItem(items[index].name);
      setQuantity(items[index].quantity);
      setEditIndex(index);
    } else {
      setNewItem("");
      setQuantity(1);
      setEditIndex(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleAddClick = async () => {
    if (newItem.trim() !== "") {
      const existingItemIndex = items.findIndex(item => item.name.toLowerCase() === newItem.toLowerCase());
      if (existingItemIndex !== -1 && editIndex === null) {
        console.log("Updating existing item...");
        console.log(`existingItemIndex: ${existingItemIndex}`);

        const updatedItems = items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
        setItems(updatedItems);

        try {
          await updateDoc(doc(db, 'inventory', items[existingItemIndex].id), { quantity: items[existingItemIndex].quantity + quantity });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else if (editIndex !== null) {
        console.log("Editing item...");
        const updatedItems = items.map((item, index) =>
          index === editIndex ? { id: items[editIndex].id, name: newItem, quantity } : item
        );
        setItems(updatedItems);

        try {
          await updateDoc(doc(db, 'inventory', items[editIndex].id), { name: newItem, quantity });
        } catch (error) {
          console.error("Error updating document:", error);
        }
      } else {
        console.log("Adding new item...");
        try {
          const docRef = await addDoc(collection(db, 'inventory'), { name: newItem, quantity });
          setItems([...items, { id: docRef.id, name: newItem, quantity }]);
        } catch (error) {
          console.error("Error adding document:", error);
        }
        console.log(items);
      }
      setNewItem("");
      setQuantity(1);
      setEditIndex(null);
      handleClose();
    }
  };

  const handleInputChange = (event) => {
    setNewItem(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchItem(event.target.value);
  };

  const handleDeleteClick = async (index) => {
    console.log("deleting");
    await deleteDoc(doc(db, 'inventory', items[index].id));
    console.log("deleted");
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleEditClick = (index) => {
    handleOpen(index);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#7C73C0" }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            <img
              src="/logo.png"
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
              onChange={handleSearch}
              value={searchItem}
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
        <Box
          height="500px"
          width="700px"
          bgcolor=""
          padding={2}
          overflow="auto"
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleOpen()}
                sx={{
                  bgcolor: "#7C73C0",
                  "&:hover": {
                    bgcolor: "#7C73C0",
                  },
                }}
              >
                Add Item
              </Button>
              
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleSubmit()}
                sx={{
                  bgcolor: "#7C73C0",
                  "&:hover": {
                    bgcolor: "#7C73C0",
                  },
                }}
              >
               Generate Recipe
              </Button>
              
            </Grid>
          </Grid>
          {loading && (
          <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

          <TableContainer component={Paper} style={{ marginTop: 20 }}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Pantry Item</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h5">Quantity</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h5">Edit</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h5">Delete</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">{item.name}</Typography>
                    </TableCell>
                    <TableCell component="th" scope="row" align="center">
                      <Typography variant="h6">{item.quantity}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditClick(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        sx={{ color: "red" }}
                        onClick={() => handleDeleteClick(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {response && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2">
                Response
              </Typography>
              <Card>
                <CardContent>
                  <Typography variant="body1">
                    {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editIndex !== null ? "Edit Item" : "Add Item"}
          </Typography>
          <TextField
            fullWidth
            id="outlined-basic"
            label="enter item name"
            variant="outlined"
            value={newItem}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mt: 2 }}
          >
            <Typography variant="h6">Quantity: {quantity}</Typography>
            <Box>
              <Button onClick={decrementQuantity} sx={{ minWidth: "30px" }}>
                -
              </Button>
              <Button onClick={incrementQuantity} sx={{ minWidth: "30px" }}>
                +
              </Button>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddClick}
            sx={{ mt: 2, bgcolor: "#7C73C0" }}
          >
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </>
  );
}
