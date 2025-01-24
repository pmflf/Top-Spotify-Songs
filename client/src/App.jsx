import './App.css';
import { lazy, Suspense } from 'react';
import WorldMap from './components/WorldMap';
const TopSongs = lazy(() => import('./components/TopSongs'));

function App() {
  return (
    <Suspense fallback={<h2>loading...</h2>}>
    <div className="App">
      <section className="WorldMap">
        <WorldMap />
      </section>
      <article className="TopSongs">
        <TopSongs />
      </article>
      <footer>
        <section className='CreaterSection'>
          <h1>Made by</h1>
          <ul>
            <li>Danny Hoang</li>
            <li>Ahmed Sobh</li>
            <li>Yun Chen Qian</li>
          </ul>
        </section>
        <section className='AttributionSection'>
          <h1>Attribution</h1>
          <p>BY-SA 4.0</p>
          <ul>
            <li><a href='https://www.kaggle.com/datasets/pieca111/music-artists-popularity'>Music artist popularity</a></li>
            <li><a href='https://www.kaggle.com/datasets/nelgiriyewithana/most-streamed-spotify-songs-2024'>Most Streamed Spotify Songs 2024</a></li>
          </ul>
          <p>Public Domain</p>
          <ul>
              <li><a href='https://www.kaggle.com/datasets/bohnacker/country-longitude-latitude'>Country latitude and longitude</a></li>
          </ul>
        </section>
      </footer>
    </div>
    </Suspense>
  );
}

export default App;

