import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { yellow } from "@mui/material/colors";
import { useLocation } from "react-router-dom";

export default function ShowData() {
  const data = useLocation().pathname.split("/")[2];
  const decodedData = JSON.parse(decodeURIComponent(data));
  const keys = Object.keys(decodedData[0]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <caption>
            * To change any data please change data in the CSV sheet and upload
            it again.
          </caption>
          <TableHead sx={{ bgcolor: yellow[300] }}>
            <TableRow>
              {keys.map((key) => (
                <TableCell align="right" key={key}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {decodedData.map((book) => (
              <TableRow
                key={book.bookId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {book.bookId}
                </TableCell>
                <TableCell align="right">{book.bookName}</TableCell>
                <TableCell align="right">{book.bookAuthor}</TableCell>
                <TableCell align="right">{book.department}</TableCell>
                <TableCell align="right">{book.priceOfBook}</TableCell>
                <TableCell align="right">{book.numberOfBooks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="mt-6">
        <Button
          fullWidth
          color="error"
          onClick={() => window.close()}
          variant="outlined"
        >
          Close
        </Button>
      </div>
    </div>
  );
}
