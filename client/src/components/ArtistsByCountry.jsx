import {useEffect, useState } from 'react';

const ArtistsByCountry = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtists = async () => {
      try{
        const response = await fetch('/api/country/United States');
        if(!response.ok) {
          throw new Error('Response was not okay');
        }
        const data = await response.json();
        setArtists(data);
      }catch (error) {
        console.error('Error fetching artists:', error);
        setError('Failed to load artists from United States');
      }
    };
    fetchArtists();
  }, []);
  

  return (
    <div>
      <h2>Artists from United States</h2>
      {error && <p>{error}</p>}
      <ul>
        {artists.map((artist, index) => 
          <li key={index}>Artist Name: {artist.name} - Artist Country: {artist.country}</li>
        )}
      </ul>
    </div>
  );
};

export default ArtistsByCountry;