import './SideBar.css';
import PropTypes from 'prop-types';
import { lazy } from 'react';
// import Artist from './Artist';
const Artist = lazy(() => import('./Artist.jsx'));
/**
 * @component
 * This component renders all the songs that were given back by the users query. By search bar or marker. 
 * @param {array} artists
 * @param {array} displayArtist
 * @param {array} displaySong
 * @param {function} onArtistClick
 */

export default function SideBar({ artists, displayArtist, onArtistClick, displaySong }) {
  const renderDefaultMessage = () => <p className = "default-message">Search for a song or artist, or click on a marker on the map to see all artist at that country!</p>;
  //This side bar dynamically maps based on where the user selects information from.(Search bar, Marker points)
  return (
    <aside className="sidebar-artists-names">
      {
        // Case 1: If there
        displaySong && displaySong.length > 0
          ? displaySong.map((song, index) => (
              <Artist
                key={`display-song-${index}`}
                name={song.song} 
                songArtistName = {song.artist}
                onClick={() => onArtistClick(song.artist)} 
              />
            ))
          
        // Case 2: If displayArtist has artist names, map over them
        : displayArtist && displayArtist.length > 0
          ? displayArtist.map((name, index) => (
              <Artist
                key={`display-artist-${index}`}
                name={name} 
                onClick={() => onArtistClick(name)} 
              />
            ))

        // Case 3: If none of the above, render artists from the 'artists' prop
        : artists && artists.length > 0
          ? artists.map((artist) => (
              <Artist
                key={artist.name}
                name={artist.name}
                onClick={() => onArtistClick(artist.name)}
              />
            ))

        // Default case: Display the "Looking for a song or artist..." message
        : renderDefaultMessage()
      }
    </aside>
  );
}
SideBar.propTypes = {
  artists: PropTypes.array.isRequired,
  onArtistClick: PropTypes.func.isRequired,
  displayArtist: PropTypes.array,  
  displaySong: PropTypes.array,    
};