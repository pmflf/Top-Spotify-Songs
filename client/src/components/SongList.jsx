import PropTypes from 'prop-types';
import Song from './Song';
/**
 * @component
 * This is a profile component that will display the artist name and all their songs. 
 * @param {arrayOf(object)} songs
 * @param {string} artistName
 */
export default function SongList({songs, artistName}){
  const capitalize = (name) =>
    name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    return (
        <div className="song-list">
            <h3>{capitalize(artistName)}</h3>
            <h4>Songs</h4>
            <ul>
                {songs.map((song,index) => (
                    <Song key={index} song={song}/>
                ))}
            </ul>
        </div>
    );
}

SongList.propTypes = {
    songs: PropTypes.arrayOf(PropTypes.object).isRequired,
    artistName: PropTypes.string.isRequired
};