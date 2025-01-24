import PropTypes from 'prop-types';
import './Artist.css'
/**
 * @component 
 * This component is to display artist name to be added on the search bar container.
 * @param {string} name(song name)
 * @param {string} songArtistName
 * @param {Event} onClick
 * @returns 
 */
export default function Artist( {name, songArtistName, onClick} ) {
  return(
    <>
      <article className="artist-box" onClick={() => onClick(name)}>
        <p><a href="#artist-info">{capitalizeWords(name)}</a></p>
        {songArtistName && (
          <p className="songArtistName">{capitalizeWords(songArtistName)}</p>
        )}
      </article>
    </>
  )
}

/**
 * Capitalizes the word given
 * @param {string} str 
 * @returns string
 */
function capitalizeWords(str){
  return str
  .split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ');
}
Artist.propTypes = {
  name: PropTypes.string,
  songArtistName: PropTypes.string,
  onClick: PropTypes.func.isRequired,
}