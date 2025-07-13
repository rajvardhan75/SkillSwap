import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box
} from "@mui/material";
import axios from "axios";
import UserCard from "../components/UserCard";

function SearchPage() {
  const [skill, setSkill] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const res = await axios.get(
      `https://skillswap-wuwu.onrender.com/api/users/search?skill=${skill}`
    );
    setResults(res.data);
  };

  const currentUserId = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id;

  return (
    <Container className="mt-4">
      <Typography variant="h4" gutterBottom>
        🔍 Find a Skill Swap Partner
      </Typography>
      <TextField
        label="Enter skill (e.g. Photoshop)"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      <Box mt={4}>
        {results.map((user) => (
          <UserCard key={user._id} user={user} currentUserId={currentUserId} />
        ))}
      </Box>
    </Container>
  );
}

export default SearchPage;
