const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

// Inisialisasi Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

const collectionName = "sample_collection"; // Nama koleksi Firestore

// GET: List Nama Laptop
app.get("/api/laptops", async (req, res) => {
    try {
      const snapshot = await db.collection(collectionName).get();
      const laptops = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().Laptop_Name,
      }));
      res.status(200).json(laptops);
    } catch (error) {
      res.status(500).json({ message: "Error fetching laptop names", error });
    }
  });
  
  // GET: Detail Laptop 
app.get("/api/items", async (req, res) => {
    try {
      const snapshot = await db.collection(collectionName).get();
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: "Error fetching data", error });
    }
  });
  
  
  // POST: Tambah Laptop Baru
  app.post("/api/laptops", async (req, res) => {
    try {
      const newLaptop = req.body; // Data laptop dari request
      const docRef = await db.collection(collectionName).add(newLaptop);
      res.status(201).json({ id: docRef.id, ...newLaptop });
    } catch (error) {
      res.status(500).json({ message: "Error adding laptop", error });
    }
  });
  
  // PUT: Update Data Laptop
  app.put("/api/laptops/:id", async (req, res) => {
    try {
      const updatedData = req.body;
      await db.collection(collectionName).doc(req.params.id).update(updatedData);
      res.status(200).json({ message: "Laptop updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating laptop", error });
    }
  });
  
  // DELETE: Hapus Laptop
  app.delete("/api/laptops/:id", async (req, res) => {
    try {
      await db.collection(collectionName).doc(req.params.id).delete();
      res.status(200).json({ message: "Laptop deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting laptop", error });
    }
  });
  
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
  
