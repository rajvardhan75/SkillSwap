import React, { useEffect, useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem,
  Tooltip, Badge, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const userId = token ? JSON.parse(atob(token.split('.')[1])).id : null;

  const [notifAnchor, setNotifAnchor] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/swaps/inbox/${userId}`);
      setNotifications(res.data.filter(req => req.status === "pending"));
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    handleMenuClose();
    navigate("/login");
  };

  const openDetails = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
    handleNotifClose();
  };

  const handleAction = async (action) => {
    try {
      if (action === "delete") {
        await axios.delete(`https://skillswap-wuwu.onrender.com/api/swaps/${selectedRequest._id}`);
      } else {
        await axios.put(`https://skillswap-wuwu.onrender.com/api/swaps/respond/${selectedRequest._id}`, {
          status: action
        });
      }
      setNotifications(prev => prev.filter(r => r._id !== selectedRequest._id));
      setModalOpen(false);
    } catch (err) {
      console.error("Action failed", err);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <i className="fas fa-exchange-alt" style={{ marginRight: "8px" }}></i>
          SkillSwap
        </Typography>

        <Button color="inherit" component={Link} to="/">
          <i className="fas fa-home" style={{ marginRight: "5px" }}></i> Home
        </Button>

        {isLoggedIn && (
          <>
            <Button color="inherit" component={Link} to="/search">
              <i className="fas fa-search" style={{ marginRight: "5px" }}></i> Search
            </Button>

            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotifOpen}>
                <Badge badgeContent={notifications.length} color="error">
                  <i className="fas fa-bell"></i>
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notifAnchor}
              open={Boolean(notifAnchor)}
              onClose={handleNotifClose}
            >
              {notifications.length === 0 ? (
                <MenuItem disabled>No new requests</MenuItem>
              ) : (
                notifications.map((notif) => (
                  <MenuItem key={notif._id} onClick={() => openDetails(notif)}>
                    From: {notif.fromUser.name}
                  </MenuItem>
                ))
              )}
            </Menu>

            <Tooltip title="Account Options">
              <IconButton onClick={handleMenuOpen} color="inherit">
                <i className="fas fa-user-circle fa-lg"></i>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                <i className="fas fa-user" style={{ marginRight: "8px" }}></i> My Profile
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate("/my-requests"); }}>
                <i className="fas fa-paper-plane" style={{ marginRight: "8px" }}></i> My Requests
              </MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); navigate("/previous-works"); }}>
                <i className="fas fa-briefcase" style={{ marginRight: "8px" }}></i> Previous Works
              </MenuItem>

              <MenuItem onClick={handleLogout}>
                <i className="fas fa-sign-out-alt" style={{ marginRight: "8px" }}></i> Logout
              </MenuItem>
            </Menu>
          </>
        )}

        {!isLoggedIn && (
          <>
            <Button color="inherit" component={Link} to="/register">
              <i className="fas fa-user-plus" style={{ marginRight: "5px" }}></i> Register
            </Button>
            <Button color="inherit" component={Link} to="/login">
              <i className="fas fa-sign-in-alt" style={{ marginRight: "5px" }}></i> Login
            </Button>
          </>
        )}
      </Toolbar>

      {/* Modal for notification details */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Swap Request</DialogTitle>
        {selectedRequest && (
          <DialogContent>
            <Typography><b>From:</b> {selectedRequest.fromUser.name}</Typography>
            <Typography><b>Email:</b> {selectedRequest.fromUser.email}</Typography>
            <Typography><b>Message:</b> {selectedRequest.message}</Typography>
            <Typography><b>Status:</b> {selectedRequest.status}</Typography>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => handleAction("rejected")} color="error">Reject</Button>
          <Button onClick={() => handleAction("accepted")} color="success">Accept</Button>
          <Button onClick={() => handleAction("delete")} color="warning">Delete</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default Navbar;
