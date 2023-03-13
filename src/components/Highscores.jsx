/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export default function Highscores({ formatTime }) {
  const [highscores, setHighscores] = React.useState([]);
  React.useEffect(() => {
    async function fetchHighscores() {
      const q = query(collection(db, "Highscores"), orderBy("time"), limit(10));
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map((doc) => doc.data());
      setHighscores(documents);
    }
    fetchHighscores();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ bgcolor: "black", color: "white" }}>
      <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="left" sx={{ color: "white" }}>
              Name
            </TableCell>
            <TableCell align="left" sx={{ color: "white" }}>
              Time
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {highscores.map((highscore, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                align="left"
                sx={{ color: "white" }}
              >
                <strong>#{index + 1} </strong> {highscore.name}
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                {formatTime(highscore.time)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
