import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
} from "@mui/material";

function InboxPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).id : null;

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/swaps/received/${userId}`);
        setRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch inbox", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchInbox();
  }, [userId]);

  const handleAction = async (id, action) => {
    try {
      await axios.put(`http://localhost:5000/api/swaps/respond/${id}`, {
        status: action,
      });
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: action } : req
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Could not perform action");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        📥 Inbox
      </Typography>
      {requests.length === 0 ? (
        <Typography>No swap requests received.</Typography>
      ) : (
        requests.map((req) => (
          <Box key={req._id} border={1} borderRadius={2} p={2} m={2}>
            <Typography><b>From:</b> {req.fromUser?.name}</Typography>
            <Typography><b>Message:</b> {req.message}</Typography>
            <Typography><b>Status:</b> {req.status}</Typography>
            {req.status === "pending" && (
              <>
                <Button onClick={() => handleAction(req._id, "accepted")} color="success" variant="contained" sx={{ mr: 1 }}>
                  Accept
                </Button>
                <Button onClick={() => handleAction(req._id, "rejected")} color="error" variant="outlined">
                  Reject
                </Button>
              </>
            )}
          </Box>
        ))
      )}
    </Container>
  );
}

export default InboxPage;
