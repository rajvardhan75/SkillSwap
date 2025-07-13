import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";

function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const userId = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).id;

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/swaps/sent/${userId}`);
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch sent requests:", err);
      }
    };

    fetchSentRequests();
  }, [userId]);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>📤 My Sent Requests</Typography>
      {requests.length === 0 ? (
        <Typography>No swap requests sent yet.</Typography>
      ) : (
        requests.map((req) => (
          <Paper key={req._id} sx={{ p: 2, mb: 2 }}>
            <Typography><strong>To:</strong> {req.toUser?.name || "Unknown"}</Typography>
            <Typography><strong>Email:</strong> {req.toUser?.email}</Typography>
            <Typography><strong>Message:</strong> {req.message}</Typography>
            <Typography><strong>Status:</strong> {req.status}</Typography>
          </Paper>
        ))
      )}
    </Container>
  );
}

export default MyRequestsPage;
