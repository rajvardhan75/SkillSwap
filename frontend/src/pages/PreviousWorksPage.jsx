import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Rating, Button } from '@mui/material';
import axios from 'axios';

function PreviousWorksPage() {
  const token = localStorage.getItem('token');
  const userId = JSON.parse(atob(token.split('.')[1])).id;
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    const fetchSwaps = async () => {
      const res = await axios.get(`https://skillswap-wuwu.onrender.com/api/swaps/accepted/${userId}`);
      setSwaps(res.data);
    };
    fetchSwaps();
  }, [userId]);

  const [feedbacks, setFeedbacks] = useState({}); // Local form state

  const handleChange = (id, field, value) => {
    setFeedbacks(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSubmit = async (swap) => {
    const role = swap.fromUser._id === userId ? 'fromSender' : 'fromReceiver';
    const payload = {
      [role]: {
        rating: feedbacks[swap._id]?.rating || 0,
        comment: feedbacks[swap._id]?.comment || ''
      }
    };
    await axios.put(`http://localhost:5000/api/swaps/feedback/${swap._id}`, payload);
    alert("✅ Feedback submitted");
    window.location.reload();
  };

  const hasGivenFeedback = (swap) => {
    const role = swap.fromUser._id === userId ? 'fromSender' : 'fromReceiver';
    return swap.feedback?.[role]?.rating;
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>📁 Previous Works</Typography>
      {swaps.map(swap => (
        <Paper key={swap._id} elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography><b>With:</b> {swap.fromUser._id === userId ? swap.toUser.name : swap.fromUser.name}</Typography>
          <Typography><b>Message:</b> {swap.message}</Typography>

          {hasGivenFeedback(swap) ? (
            <Typography color="success.main" mt={2}><b>✅ Feedback Given</b></Typography>
          ) : (
            <Box mt={2}>
              <Typography gutterBottom><b>Give Feedback</b></Typography>
              <Rating
                value={feedbacks[swap._id]?.rating || 0}
                onChange={(e, newVal) => handleChange(swap._id, 'rating', newVal)}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write your feedback..."
                value={feedbacks[swap._id]?.comment || ''}
                onChange={(e) => handleChange(swap._id, 'comment', e.target.value)}
                sx={{ mt: 1 }}
              />

              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => handleSubmit(swap)}
              >
                Submit
              </Button>
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default PreviousWorksPage;
