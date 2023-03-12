import * as React from "react";
import { Container } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Navbar from "../components/Navbar";
import Game1 from "../assets/game1.jpg";
import CC from "../assets/CC.png";
import Cortana from "../assets/Cortana.png";

export default function GamePage() {
  const [positions, setPositions] = React.useState(null);
  const [characters, setCharacters] = React.useState([
    { name: "C.C", from: "Code Geass", image: CC, found: false },
    { name: "Cortana", from: "Halo", image: Cortana, found: false },
  ]);
  const open = Boolean(positions);
  const handleClick = (event) => {
    const img = document.getElementById("image");

    // use relative form so it can work on any screen size
    const relX = event.pageX / img.offsetWidth;
    const relY = (event.pageY - 64) / img.offsetHeight; // 64 is height of navbar
    console.log(relX, relY);
    if (open) {
      setPositions(null);
    } else {
      setPositions({ x: event.clientX, y: event.clientY });
    }
  };
  const handleClose = () => {
    setPositions(null);
  };
  const id = open ? "simple-popover" : undefined;
  return (
    <Container
      sx={{ m: 0, p: 0, bgcolor: "black" }}
      maxWidth={false}
      disableGutters
    >
      <Navbar characters={characters} />
      <Container
        sx={{ m: 0, p: 0, flexGrow: 1, width: "100%", bgcolor: "black" }}
        maxWidth={false}
        disableGutters
        onClick={handleClick}
      >
        <img
          id="image"
          style={{ width: "100%", objectFit: "contain", margin: 0 }}
          src={Game1}
          alt="Game"
        />
        <Popover
          id={id}
          open={open}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: positions?.y, left: positions?.x }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          PaperProps={{
            style: {
              backgroundColor: "black",
            },
          }}
        >
          {characters &&
            characters.map(
              (character) =>
                !character.found && (
                  <MenuItem key={character.id}>
                    <Typography
                      variant="p"
                      component="div"
                      sx={{
                        textAlign: "center",
                        flexGrow: 1,
                        color: "white",
                      }}
                    >
                      {character.name}
                    </Typography>
                  </MenuItem>
                )
            )}
        </Popover>
      </Container>
    </Container>
  );
}
