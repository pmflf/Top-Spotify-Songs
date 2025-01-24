import PropTypes from 'prop-types';
import { useEffect } from 'react';
/**
 * @component
 *This component handles user input on the search bars and it displays the search bars.
 * @param {string} queryArtist
 * @param {function} setQueryArtist
 * @param {function} setDisplayArtist
 * @param {array} artistsNames
 * @param {string} querySong
 * @param {function} setQuerySong
 * @param {function} setDisplaySong
 * @param {function} setArtists
  */
function SearchContainer({ queryArtist, setQueryArtist,setDisplayArtist,artistsNames,querySong,setQuerySong, setDisplaySong,setArtists })
{
  // This useEffect is required or else leaflet will not work
  useEffect(() => {
    if (queryArtist && artistsNames.length > 0) {
      const filteredArtists = artistsNames
        .filter((artist) =>
          artist.toLowerCase().includes(queryArtist.toLowerCase())
        )
        .slice(0, 20);
      setDisplayArtist(filteredArtists); 
    } else {
      setDisplayArtist([]);
    }
  }, [queryArtist]); 
  const handleChangeQueryArtist = (event) => {
    const value = event.target.value;
    setQuerySong("");
    setArtists([]);
    setDisplaySong([]);
    setQueryArtist(value);
  };

  const handleChangeQuerySong = (event) => {
    const value = event.target.value;
    setQueryArtist("")
    setArtists([])
    setDisplayArtist([])
    if (value) {
      fetch(`/api/songs/name/${value}`)
        .then(response => response.json())
        .then(data => {
         
          setDisplaySong(data);
        })
        .catch((error) => {
          console.error('Error fetching songs:', error);
          setDisplaySong([]);
        });
    } else {
      setDisplaySong([]);
    }
    setQuerySong(value)

  }
  

  return (
    <section className="search-container">
      <h1>🌍2024&apos;s Greatest Hit</h1>
      <form className="search-options">
        <label>
          <input
            type="text"
            placeholder="Search by artist name"
            value={queryArtist}
            onChange={handleChangeQueryArtist}
          />
        </label>
        <label>
          <input 
            type="text"
            placeholder="Search by song title" 
            value={querySong}
            onChange={handleChangeQuerySong}
            />
        </label>
      </form>
    </section>
  );
}

SearchContainer.propTypes = {
  queryArtist: PropTypes.string.isRequired,
  setQueryArtist: PropTypes.func.isRequired,
  setDisplayArtist: PropTypes.func.isRequired,
  artistsNames: PropTypes.array.isRequired, 
  displayArtist: PropTypes.array,
  querySong: PropTypes.string.isRequired,
  setQuerySong: PropTypes.func.isRequired,
  setDisplaySong: PropTypes.func.isRequired,
  setArtists:PropTypes.func.isRequired
};

export default SearchContainer;

