import {Suspense, useEffect, useState } from 'react';
import Plotly from 'plotly.js-basic-dist-min';
import createPlotlyComponent from "react-plotly.js/factory";
import './TopSongs.css';

/**
 * @component
 * TopSongs Component
 * This component fetches and displays the top 50 songs from an API endpoint,
 * showing them in a horizontal bar chart with song names and Spotify stream counts.
 */
const TopSongs = () => {
    const Plot = createPlotlyComponent(Plotly);
    const [topSongs, setTopSongs] = useState([]);
    const [error, setError] = useState(null);

    /**
     * useEffect Hook
     * Fetches the top 50 songs data from the API.
     * Sets the data in state if successful, or an error message if the fetch fails.
     */
    useEffect(() => {
        const fetchSongs = async() => {
            try {
                const response = await fetch('/api/songs/top50');
                if(!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTopSongs(data);
            } catch(error){
                setError(error.message);
            }
        };
        fetchSongs();
    },[]);

    if(error) {
        return <div>Error: {error}</div>
    }

    const songNames = topSongs.map(song => song.song);
    const streams = topSongs.map(song => song.spotifyStreams);
    const text = topSongs.map(song => song.artist + ' - ' + song.spotifyStreams.toLocaleString())

    // Data structure for the Plotly chart
    const data = [{
        type: 'bar',
        x: streams,
        y: songNames,
        orientation: 'h',
        text: text,
        textposition: 'inside',
        marker: {
            color: 'rgba(0,255,0,1.0)',
            line: {
                color: 'rgba(0,0,255,1.0)',
                width: 0
            }
        }
    }]

    // Layout configuration for the Plotly chart
    const layout = {
        title: 'Top Songs by Spotify Streams',
        xaxis: {
            title: 'Number of Streams',
            zeroline: false
        },
        yaxis: {
            title: 'Songs',
            autorange: 'reversed',
            tickfont: {
                size: 9
            }
        },
        margin: {
            l: 125,
            r: 20,
            t: 50,
            b: 70
        },
        width: 1500,
        height: 3000,
        paper_bgcolor: 'rgb(255,255,255)',
        plot_bgcolor: 'rgb(255,255,255)'
    };

    return (
        <Suspense fallback={<p>Loading...</p>}>
            <section>
                <h1>Top Songs</h1>
                <div className="scrollable-chart-container">
                    <Plot
                        data={data}
                        layout={layout}
                        config={{ responsive: true }}
                    />
                </div>
            </section>
        </Suspense>
    );

};

export default TopSongs;

