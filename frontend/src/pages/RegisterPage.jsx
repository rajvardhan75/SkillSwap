import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillsOffered: "",
    skillsWanted: "",
    availability: "Mornings",
    isPublic: true,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert comma-separated strings to arrays
    const payload = {
      ...form,
      skillsOffered: form.skillsOffered.split(",").map((s) => s.trim()),
      skillsWanted: form.skillsWanted.split(",").map((s) => s.trim()),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", payload);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            label="Skills Offered (comma separated)"
            name="skillsOffered"
            fullWidth
            margin="normal"
            value={form.skillsOffered}
            onChange={handleChange}
          />
          <TextField
            label="Skills Wanted (comma separated)"
            name="skillsWanted"
            fullWidth
            margin="normal"
            value={form.skillsWanted}
            onChange={handleChange}
          />
          <TextField
            select
            label="Availability"
            name="availability"
            fullWidth
            margin="normal"
            value={form.availability}
            onChange={handleChange}
          >
            <MenuItem value="Mornings">Mornings</MenuItem>
            <MenuItem value="Afternoons">Afternoons</MenuItem>
            <MenuItem value="Evenings">Evenings</MenuItem>
          </TextField>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isPublic}
                onChange={handleChange}
                name="isPublic"
              />
            }
            label="Make profile public"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default RegisterPage;
