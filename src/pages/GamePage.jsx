import * as React from "react";
import { Container } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import TextField from "@mui/material/TextField";
import Navbar from "../components/Navbar";
import Highscores from "../components/Highscores";
import { db } from "../config/firebase";

import Game1 from "../assets/game1.jpg";
import CC from "../assets/CC.png";
import Cortana from "../assets/Cortana.png";
import Avatar from "../assets/Aang.webp";
import Dio from "../assets/Dio.png";
import Tom from "../assets/Tom.png";

const Alert = React.forwardRef((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));
export const formatTime = (time) => {
  const getSeconds = `0${Math.round(time % 60)}`.slice(-2);
  const minutes = `${Math.floor(time / 60)}`;
  const getMinutes = `0${minutes % 60}`.slice(-2);
  const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

  return `${getHours}:${getMinutes}:${getSeconds}`;
};

export default function GamePage() {
  const [divs, setDivs] = React.useState([]);
  const [timer, setTimer] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [relPositions, setRelPositions] = React.useState({ x: 0, y: 0 });
  const [anchorPosition, setAnchorPosition] = React.useState(null);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState({
    message: "",
    severity: "success",
  });
  const [characters, setCharacters] = React.useState([
    { name: "C.C", from: "Code Geass", image: CC, found: false },
    { name: "Cortana", from: "Halo", image: Cortana, found: false },
    {
      name: "Avatar",
      from: "Avatar The Last Airbender",
      image: Avatar,
      found: false,
    },
    { name: "Dio", from: "JoJo", image: Dio, found: false },
    { name: "Tom", from: "Tom & Jerry", image: Tom, found: false },
  ]);
  React.useEffect(() => {
    let interval;
    if (!gameOver) {
      interval = setInterval(() => {
        setTimer((time) => time + 1);
        const allFound = characters.every((character) => character.found);
        if (allFound) {
          setGameOver(true);
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [characters]);

  const open = Boolean(anchorPosition);

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent default form submission behavior
    const name = event.target.name.value;
    const collectionRef = collection(db, "Highscores");
    await addDoc(collectionRef, { name, time: timer });
    setSubmitted(true);
  };

  const handleClick = (event) => {
    const img = document.getElementById("image");

    // use relative form so it can work on any screen size
    const relX = event.pageX / img.offsetWidth;
    const relY = (event.pageY - 64) / img.offsetHeight; // 64 is height of navbar
    if (open) {
      setAnchorPosition(null);
    } else {
      setAnchorPosition({ top: event.clientY, left: event.clientX });
      setRelPositions({ x: relX, y: relY });
    }
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackOpen(false);
  };

  const handleClose = () => {
    setAnchorPosition(null);
  };

  const id = open ? "simple-popover" : undefined;

  const handleSelection = (name, x, y) => {
    const docRef = doc(db, "Characters", name);
    getDoc(docRef)
      .then((document) => {
        if (document.exists()) {
          const data = document.data();
          const testX = Math.abs(x - data.x) < 0.042;
          const testY = Math.abs(y - data.y) < 0.01;
          if (testX && testY) {
            setCharacters((prevCharacters) => {
              const newCharacters = prevCharacters.map((character) => {
                if (character.name === name) {
                  return { ...character, found: true };
                }
                return character;
              });
              return newCharacters;
            });
            setSnackMessage({
              message: `You found ${name}!`,
              severity: "success",
            });
            setSnackOpen(true);
            const newDiv = (
              <div
                key={name}
                style={{
                  position: "absolute",
                  width: "6%",
                  height: "1.5%",
                  zIndex: "10",
                  backgroundColor: "#8AFF8A",
                  top: `${data.y * 100}%`,
                  left: `${data.x * 100}%`,
                  transform: "translate(-50%, -50%)",
                  opacity: "60%",
                  border: "5px #007500 solid",
                  borderRadius: 100,
                }}
              />
            );
            setDivs((prevDivs) => [...prevDivs, newDiv]);
          } else {
            setSnackMessage({
              message: `${name} does not seem to be there`,
              severity: "info",
            });
            setSnackOpen(true);
          }
        } else {
          setSnackMessage({
            message: `${name} character does not exist`,
            severity: "error",
          });
          setSnackOpen(true);
        }
      })
      .catch((error) => {
        setSnackMessage({
          message: `Firebase error: ${error}`,
          severity: "error",
        });
        setSnackOpen(true);
      });
  };

  return (
    <Container
      sx={{ m: 0, p: 0, bgcolor: "black" }}
      maxWidth={false}
      disableGutters
    >
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        disableAutoFocus
        open={gameOver}
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={gameOver}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: "70%",
              bgcolor: "black",
              border: "2px white solid",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography
              id="transition-modal-title"
              variant="h4"
              component="h2"
              sx={{ color: "white", textAlign: "center" }}
            >
              High<strong style={{ color: "red" }}>Scores</strong>
            </Typography>
            {!submitted && (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: "5px",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ color: "white", textAlign: "center" }}
                >
                  Add your own High
                  <strong style={{ color: "red" }}>Score</strong>!
                </Typography>
                <Typography
                  id="transition-modal-title"
                  variant="h6"
                  component="h2"
                  sx={{ color: "white", textAlign: "center" }}
                >
                  {formatTime(timer)}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justfiyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    color="success"
                    required
                    sx={{
                      color: "black",
                      bgcolor: "white",
                    }}
                    id="name"
                    label="Name"
                    variant="filled"
                    size="small"
                  />
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </div>
              </form>
            )}
            {submitted && <Highscores formatTime={formatTime} />}
          </Box>
        </Fade>
      </Modal>

      <Navbar characters={characters} timer={timer} formatTime={formatTime} />
      <Snackbar
        open={snackOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={(event, reason) => handleCloseSnack(event, reason)}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snackMessage.severity}
          sx={{ width: "100%" }}
        >
          {snackMessage.message}
        </Alert>
      </Snackbar>
      <Container
        sx={{
          m: 0,
          p: 0,
          flexGrow: 1,
          width: "100%",
          bgcolor: "black",
          position: "relative",
        }}
        maxWidth={false}
        disableGutters
        onClick={handleClick}
      >
        {divs}
        <img
          id="image"
          style={{
            width: "100%",
            objectFit: "contain",
            margin: 0,
            userSelect: "none",
          }}
          src={Game1}
          alt="Game"
        />
        <Popover
          id={id}
          open={open}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={anchorPosition}
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
                  <MenuItem
                    key={character.name}
                    onClick={() =>
                      handleSelection(
                        character.name,
                        relPositions.x,
                        relPositions.y
                      )
                    }
                  >
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
