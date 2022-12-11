import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useContext, Fragment } from "react";
import { ContextAPI } from "../utils/ContextAPI.jsx";
import isAuth from "../utils/isAuth.jsx";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Badge from "@mui/material/Badge";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Face6OutlinedIcon from "@mui/icons-material/Face6Outlined";
import HistoryEduOutlinedIcon from "@mui/icons-material/HistoryEduOutlined";

const drawerWidth = 240;

export default function ClippedDrawer({ children, d, window }) {
  const { basket, userData, count } = useContext(ContextAPI);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {[
          {
            icon: <Face6OutlinedIcon />,
            name: "Profile",
            permission: ["admin", "user"],
            link: "profile",
          },
          {
            icon: <PendingActionsOutlinedIcon />,
            name: "Pending orders",
            permission: ["admin"],
            link: "pending-orders",
          },
          {
            icon: <SearchOutlinedIcon />,
            name: "Search for user",
            permission: ["admin"],
            link: "search-user",
          },
          {
            icon: <HistoryEduOutlinedIcon />,
            name: "Logs",
            permission: ["admin"],
            link: "logs",
          },
        ].map(
          (item, index) =>
            //check if user is admin or not
            userData &&
            item.permission.includes(userData.role) && (
              <ListItem
                button
                key={item.name}
                onClick={() => navigate(`/${item.link}`)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            )
        )}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          marginBottom: "40px",
          bgcolor: "#116A57",
          zIndex: 999,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
          >
            Stock&Co
          </Typography>
        </Toolbar>
        <Box
          sx={{
            mr: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Badge
            badgeContent={basket.length}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            color="secondary"
          >
            <ShoppingBasketIcon
              sx={{ fontSize: 30, marginRight: "10px" }}
              onClick={() => navigate("/shopping")}
            />
          </Badge>
          <IconButton sx={{ p: 0 }}>
            {isAuth() ? (
              <Avatar
                alt="Remy Sharp"
                src="/static/images/avatar/2.jpg"
                onClick={() => navigate("/profile")}
              />
            ) : (
              <Typography
                onClick={() => navigate("/login")}
                sx={{ color: "white" }}
              >
                Login
              </Typography>
            )}
          </IconButton>
        </Box>
      </AppBar>
      {d && (
        <>
          <Box
            component="nav"
            sx={{
              width: { sm: drawerWidth, zIndex: 1 },
              flexShrink: { sm: 0 },
            }}
            aria-label="mailbox folders"
          >
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
            )
          </Box>
        </>
      )}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
