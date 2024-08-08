'use client'
import { useState, useEffect } from "react";
import { firestore } from "@/firebase"; 
import { Box, Button, Modal, Stack, TextField, Typography, Card, CardContent, CardActions } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc } from "firebase/firestore"; 

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
      setInventory((prevInventory) =>
        prevInventory.map((invItem) =>
          invItem.name === item
            ? { ...invItem, quantity: quantity + 1 }
            : invItem
        )
      );
    } else {
      await setDoc(docRef, { quantity: 1 });
      setInventory((prevInventory) => [
        ...prevInventory,
        { name: item, quantity: 1 },
      ]);
    }
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        setInventory((prevInventory) =>
          prevInventory.filter((invItem) => invItem.name !== item)
        );
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
        setInventory((prevInventory) =>
          prevInventory.map((invItem) =>
            invItem.name === item
              ? { ...invItem, quantity: quantity - 1 }
              : invItem
          )
        );
      }
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box 
      width="100vw" 
      minHeight="100vh" 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="center" 
      p={3}
      bgcolor="#f7f7f7"
    >
      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute" 
          top="50%" 
          left="50%" 
          sx={{ transform: "translate(-50%, -50%)" }}
          width={400} 
          bgcolor="white" 
          border="2px solid #000" 
          boxShadow={24} 
          p={4} 
          display="flex" 
          flexDirection="column" 
          gap={3}
        >
          <Typography variant="h6" fontWeight="bold">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Search Bar */}
      <TextField
        label="Search Inventory"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: "100%", maxWidth: "600px", marginBottom: 3 }}
      />

      {/* Add New Item Button */}
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ marginBottom: 3 }}>
        Add New Item
      </Button>

      {/* Inventory List */}
      <Box 
        width="100%" 
        maxWidth="1200px" 
        display="flex" 
        flexWrap="wrap" 
        gap={3}
        justifyContent="center"
      >
        {filteredInventory.map(({ name, quantity }) => (
          <Card key={name} sx={{ width: "300px" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quantity: {quantity}
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                variant="contained" 
                onClick={() => addItem(name)}
              >
                Add
              </Button>
              <Button 
                size="small" 
                variant="contained" 
                onClick={() => removeItem(name)}
              >
                Remove
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
