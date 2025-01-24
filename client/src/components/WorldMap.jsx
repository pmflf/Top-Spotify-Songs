import { Icon  } from 'leaflet';
import { 
  MapContainer, 
  TileLayer, 
  Marker,
} from 'react-leaflet';
import { lazy } from 'react';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import markerImage from '../assets/marker-icon.png';
import SideBar from './SideBar';
import './SideBar.css'
import './SearchBar.css'
const SongList = lazy(() => import('./SongList.jsx'));
import SearchContainer from './SearchBar';

const customIcon = new Icon({
  iconUrl: markerImage,
  iconSize: [38, 38],
  iconAnchor: [22, 30]
});
/**
 * 
 * @component
 * World map is the parent of all the other components it renders a map, search bars, side bar, and below the fold. ArtistProfile.
 */
export default function WorldMap() {
  const [error, setError] = useState('');
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [artistName, setArtistName] = useState('');
  const [artistsNames, setArtistsNames] = useState([]);
  const [queryArtist,setQueryArtist] = useState("");
  const [displayArtist, setDisplayArtist] = useState([]);
  const [querySong, setQuerySong] = useState("");
  const [displaySong, setDisplaySong] = useState([]);
  const [countries, setCountries] = useState([]);
  async function getArtists(country){
    const artistsFromCountry = await fetch('/api/country/'+country);
    const artistsJson = await artistsFromCountry.json();
    if ('status' in artistsJson[0]){
      setError('encountered issue while fetching artists')
    }
    console.log(Object.values(artistsJson))
    setArtists(Object.values(artistsJson))
  } 

  async function handleArtistClick(artistName) {
    setArtistName(artistName);
    try{
      const encodedArtistName = encodeURIComponent(artistName);
      const response = await fetch('/api/artist/'+encodedArtistName);
      const data = await response.json();
      setSongs(data.songs);
    }catch (e) {
      setError("Error fetching artists: " + e.message);
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const resp = await fetch ('api/country');
        const data = await resp.json();

        if ('status' in data){
          setError('problem with fetching countries')
        } else {
          setCountries(data)
        }
      } catch (e) {
        setError('Error fetching countries: ' + e)
      }
    }
    const fetchArtistsNames = async () => {
      try {
        const response = await fetch('api/artists');
        const data = await response.json();
        if (data) {
          setArtistsNames(data); 
        
        } else {
          setError('No artists found');
        }
      } catch (e) {
        setError('Error fetching artists' + e);
      }
    };
    fetchCountries();
    fetchArtistsNames();
  }, []);
  
  const attribution = 
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  
  return (
    <section className="page-container">
      <main className="above-fold">
        <SearchContainer 
              queryArtist={queryArtist} 
              setQueryArtist={setQueryArtist}
              setDisplayArtist={setDisplayArtist}
              artistsNames={artistsNames}
              setQuerySong={setQuerySong}
              querySong={querySong}
              setDisplaySong ={setDisplaySong}
              setArtists={setArtists}
          
        />
        {error && <p className='error'>Error: {error}</p>}
        <header className="ui-container">  
          <MapContainer
            className="map-container"
            center={[0, 0]}
            zoom={12}
            zoomControl={true}
            updateWhenZooming={false}
            updateWhenIdle={true}
            preferCanvas={true}
            minZoom={2}
            maxZoom={4}
          >
            <TileLayer
              attribution={attribution}
              url={tileUrl}
            />    
            {
              countries.map((c) => {
                return (
                  <Marker
                    id={c['name']}
                    key={c['name']} 
                    position={[c['coordinates'][1], c['coordinates'][0]]}
                    icon={customIcon} 
                    eventHandlers={{
                      click: (event) => {
                        setQuerySong("")
                        setQueryArtist("")
                        setDisplayArtist([])
                        setDisplaySong([])
                        getArtists(event.target.options.id)
                      }
                    }}
                  />
                )
              })
            }
          </MapContainer>

          <div className="sidebar-container">
            <h2>⭐ Featured Artists ⭐</h2>
            <SideBar
              artists={artists}
              displayArtist={displayArtist}
              onArtistClick={handleArtistClick}
              displaySong={displaySong}
            />
          </div>
        </header>
      </main>

      <section className="below-fold">
        <div id="artist-info" className="song-information">
          {songs.length > 0 ? (
            // NOTE maybe like a true or false to display song list right before? 
            // seems not worth for 0.40 kb
            <SongList songs={songs} artistName={artistName} />
          ) : (
            <p>Select an artist to view their songs.</p>
          )}
        </div>
      </section>
    </section>
  );
}