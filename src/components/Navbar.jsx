/* eslint-disable react/prop-types */
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";

export default function Navbar({ characters }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="sticky" sx={{ flexGrow: 1, bgcolor: "black" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Waldo<strong style={{ color: "red" }}>Game</strong>
        </Typography>
        <Button
          id="basic-button"
          sx={{ bgColor: "black", color: "white", gap: 1 }}
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <VideogameAssetIcon />
          Characters
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
            backgroundColor: "black",
          }}
          PaperProps={{
            style: {
              backgroundColor: "black",
            },
          }}
        >
          {characters &&
            characters.map((character) => (
              <MenuItem
                sx={{
                  width: 400,
                  ...(character.found && { filter: "grayscale(100%)" }),
                }}
              >
                <img
                  style={{ width: "40%" }}
                  src={character.image}
                  alt={character.name}
                />
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textAlign: "center",
                    flexGrow: 1,
                    color: "white",
                    ...(character.found && {
                      textDecoration: "line-through",
                      opacity: 0.6,
                    }),
                  }}
                >
                  {character.name} <br />
                  <span style={{ fontSize: "15px" }}>{character.from}</span>
                </Typography>
              </MenuItem>
            ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
