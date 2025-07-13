import React from "react";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

const UserCard = ({ user, currentUserId }) => {
  const handleSendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://skillswap-wuwu.onrender.com/api/swaps/send",
        {
          fromUser: currentUserId,
          toUser: user._id,
          message: `Let's swap! I can help with ${user.skillsWanted.join(", ")}.`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Swap request sent!");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send request.");
    }
  };

  return (
    <Box border={1} padding={2} margin={2}>
      <Typography variant="h6">{user.name}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Offers: {user.skillsOffered.join(", ")}</Typography>
      <Typography>Wants: {user.skillsWanted.join(", ")}</Typography>
      <Typography>Availability: {user.availability}</Typography>
      <Button variant="contained" onClick={handleSendRequest}>
        Send Swap Request
      </Button>
    </Box>
  );
};

export default UserCard;
