import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Pagination from "@material-ui/lab/Pagination";
import Header from "./components/Header";
import {
  createMuiTheme,
  MuiThemeProvider,
  CssBaseline,
  Dialog,
  DialogContent,
  IconButton
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: "#8b008b" },
    secondary: { main: "#f50057" }
  }
});

function App() {
  const [moviesList, setMoviesList] = useState([]);
  const [moviesInfo, setMoviesInfo] = useState([]);
  const [moviePoster, setMoviePoster] = useState([]);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  let ListBuffer = null;
  let infoBuffer = null;
  useEffect(() => {
    axios({
      method: "get",
      url: `https://cdn-discover.hooq.tv/v1.2/discover/feed?region=ID&page=${page}&perPage=20`
    }).then(async res => {
      ListBuffer = await res.data.data;
      setMoviesList(
        ListBuffer.filter(
          movies => movies.type === "Multi-Title-Manual-Curation"
        )
      );
    });
  }, [page]);

  const getMovieInfo = id => {
    axios({
      method: "get",
      url: `https://cdn-discover.hooq.tv/v1.2/discover/titles/${id}`
    })
      .then(async res => {
        infoBuffer = await res.data.data;
        setMoviesInfo(infoBuffer);
      })
      .then(() => {
        setIsOpen(true);
      });
  };
  const handleCLoseDialog = () => {
    setIsOpen(false);
  };
  return (
    <div className="App">
      {moviesList ? (
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <Dialog open={isOpen} onClose={handleCLoseDialog}>
            <DialogContent>
              <div className="movieCard">
                <img className="cardPoster" src={moviePoster} alt="" />
                <div className="cardDescription">
                  <h1>{moviesInfo.title}</h1>
                  <p>{moviesInfo.description}</p>
                </div>

                <div className="closeCard">
                  <IconButton onClick={handleCLoseDialog}>
                    <Close />
                  </IconButton>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Header />
          {moviesList.map((moviesRow, key) => {
            return (
              <div className="carousellContainer">
                <h1 key={key} className="rowName">
                  {moviesRow.row_name
                    ? moviesRow.row_name
                    : "No title provided"}
                </h1>
                <div className="Imagescarousell">
                  {moviesRow.data.map((movie, key) => {
                    return (
                      <div className="movieListing">
                        <img
                          onClick={event => {
                            setMoviePoster(event.target.src);
                            getMovieInfo(movie.id);
                          }}
                          src={
                            movie.images.find(image => {
                              return image.type === "POSTER";
                            }).url
                          }
                          alt=""
                        />
                        <h3>{movie.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="paginationContainer">
            <Pagination
              className="pagination"
              count={2}
              color="primary"
              onChange={(event, page) => {
                setPage(page);
              }}
            />
          </div>
        </MuiThemeProvider>
      ) : null}
    </div>
  );
}

export default App;
