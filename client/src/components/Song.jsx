import PropTypes from 'prop-types';
/**
 * @component
 * This component displays songs and their stream count
 * @param {object} song
 */
export default function Song({ song }) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <li>
      <div>
        {capitalize(song.name)}
      </div>
      <div>
        {song.spotifyStreams} Plays
      </div>
    </li>
  );
}


Song.propTypes = {
    song: PropTypes.object.isRequired
};