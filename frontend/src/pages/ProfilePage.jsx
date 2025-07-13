import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";

function ProfilePage() {
  const [form, setForm] = useState({
    name: "",
    skillsOffered: "",
    skillsWanted: "",
    availability: "",
    isPublic: true,
  });

  const userId = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id;

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}`);
      const { name, skillsOffered, skillsWanted, availability, isPublic } = res.data;
      setForm({
        name,
        skillsOffered: skillsOffered.join(", "),
        skillsWanted: skillsWanted.join(", "),
        availability,
        isPublic,
      });
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}`, {
        ...form,
        skillsOffered: form.skillsOffered.split(",").map((s) => s.trim()),
        skillsWanted: form.skillsWanted.split(",").map((s) => s.trim()),
      });
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Failed to update profile");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          🧑‍💼 Edit Your Profile
        </Typography>
        {form.averageRating !== undefined && (
            <Typography variant="h6" align="center" color="goldenrod" gutterBottom>
                ⭐ Average Rating: {form.averageRating.toFixed(2)}
            </Typography>
        )}


        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Full Name"
            fullWidth
            value={form.name}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            name="skillsOffered"
            label="Skills Offered (comma separated)"
            fullWidth
            value={form.skillsOffered}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            name="skillsWanted"
            label="Skills Wanted (comma separated)"
            fullWidth
            value={form.skillsWanted}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <TextField
            name="availability"
            label="Availability"
            fullWidth
            value={form.availability}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.isPublic}
                onChange={handleChange}
                name="isPublic"
                color="primary"
              />
            }
            label="Public Profile"
            sx={{ mt: 2 }}
          />

          <Box mt={3} display="flex" justifyContent="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, py: 1 }}
            >
              Save Changes
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default ProfilePage;
