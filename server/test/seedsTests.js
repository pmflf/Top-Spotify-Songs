import { sortSongs, sortCountries } from '../utils/seed.js';
import * as chai from 'chai';
const expect = chai.expect;

describe('sortSongs', () => {
  it('should parse and format song data correctly', () => {
    const mockSongs = [
      'Track,Album Name,Artist,Release Date,ISRC,All Time Rank,Track Score,Spotify Streams,' +
      'Spotify Playlist Count,Spotify Playlist Reach,Spotify Popularity,YouTube Views,' + 
      'YouTube Likes,TikTok Posts,TikTok Likes,TikTok Views,YouTube Playlist Reach,Apple Music' + 
      'Playlist Count,AirPlay Spins,SiriusXM Spins,Deezer Playlist Count,Deezer Playlist Reach,' +
      'Amazon Playlist Count,Pandora Streams,Pandora Track Stations,Soundcloud Streams,' +
       'Shazam Counts,TIDAL Popularity,Explicit Track',
      'MILLION DOLLAR BABY,Million Dollar Baby - Single,Tommy Richman,' +
       '4/26/2024,"390,470,936","30,716","196,631,588",92,' +
       '"84,274,754","1,713,126","5,767,700","651,565,900",' +
       '"5,332,281,936","150,597,040",210,"40,975",684,62,' +
       '"17,598,718",114,"18,004,655","22,931","4,818,457",' +
       '"2,669,262",0',      ''
    ];

    const result = sortSongs(mockSongs);

    expect(result).to.deep.equal([
      {
        song: 'million dollar baby',
        artist: 'tommy richman',
        spotifyStreams: 390470936
      
      }
    ]);
  });

  it('should return an empty array if no songs are provided', () => {
    const allSongs = [];
    const result = sortSongs(allSongs);
    expect(result).to.deep.equal([]);
  
  });
});

describe('sortCountries', () => {
  it('should parse and format country data correctly', () => {
    const mockCountries = [
      'Country,ISO-ALPHA-3,ISO-ALPHA-2,IOC,FIFA,Latitude,Longitude,ISO-Name,Historical,' +
      'WikiData_ID,WikiData_Latitude,WikiData_Longitude,WikiData_Label,WikiData_Description',
      'United States,USA,US,USA,USA,37.09024,-95.712891,0,0,Q30,39.83,-98.58,' +
      'United States of America,"sovereign state in North America"',
      'Canada,CAN,CA,CAN,CAN,56.130366,-106.346771,1,0,Q16,56.00,-109.00,Canada,' +
      '"sovereign state in North America"'
    ];

    const mockArtists = [
      { name: 'artist1', country: 'united states' },
      { name: 'artist2', country: 'canada' }
    ];
    const result = sortCountries(mockCountries, mockArtists);

    expect(result).to.deep.equal([
      {
        name: 'united states',
        coordinates: [-95.712891, 37.09024]
      },
      {
        name: 'canada',
        coordinates: [-106.346771, 56.130366]
      }
    ]);
  });

  it('should return an empty array if no countries are provided', () => {
    const result = sortCountries([]);
    expect(result).to.deep.equal([]);
  });
});

// describe('sortArtistWithSongs', function() {
//   it('should return the correct artist object when matching songs are found', function() {
//     // Sample artist data
//     const mockArtist = [
//       'mbid,artist_mb,artist_lastfm,country_mb,country_lastfm,' +
//       'tags_mb,tags_lastfm,listeners_lastfm,scrobbles_lastfm,ambiguous_artist',
//       '381086ea-f511-4aba-bdf9-71c753dc5077,Kendrick Lamar,Kendrick Lamar,' +
//       'United States,United States,' +
//       'pop; hip hop; pop rap; west coast hip hop; boom bap; ' +
//       'jazz rap; conscious hip hop; hardcore hip hop,' +
//       'Hip-Hop; rap; seen live; west coast; compton; ' +
//       'California; hip hop; american; jazz rap; West Coast Rap; ' +
//       'Conscious Hip Hop; underground hip-hop; west coast hip-hop; ' +
//       'black hippy; kendrick lamar; conscious hip-hop; west coast hip hop; ' +
//       'los angeles; hiphop; underground rap; USA; male vocalists; ' +
//       'tde; funk; Jazz Hop; 10s; hardcore hip-hop; swag; ' +
//       'Gangsta Rap; alternative hip-hop; pop rap; abstract hip-hop; ' +
//       '2010s; experimental hip hop,' +
//       '1472390,103146720,FALSE'
//     ];

//     // Sample songs data
//     const mockSongs = [
//       { artist: 'kendrick lamar', song: 'not like us, Spotify Streams: 323703884' },
//       { artist: 'kendrick lamar', song: 'euphoria, Spotify Streams: 168434320' },
//       { artist: 'drake', song: 'hotline bling, Spotify Streams: 234567890' },
//     ];

//     const result = sortArtistWithSongs(mockArtist, mockSongs);
//     const expected = [
//       {
//         name: 'kendrick lamar',
//         country: 'united states'
//       }
//     ];

//     // Assertion
//     expect(result).to.deep.equal(expected);
//   });

//   it('should return an empty array when no matching songs are found', function() {
//     const mockArtists = [
//       'ID,Name,Genre,Country', 
//       '1,Kendrick Lamar,Hip Hop,United States',
//     ];

//     //  no matching artist
//     const mockSongs = [
//       { artist: 'drake', song: 'hotline bling', spotifyStreams: '234567890' },
//     ];
//     const result = sortArtistWithSongs(mockArtists, mockSongs);
//     expect(result).to.deep.equal([]);
//   });
// });

