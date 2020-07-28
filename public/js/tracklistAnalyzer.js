const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('access_token');

$.ajax({
    type: "GET",
    url: "https://api.spotify.com/v1/me/top/tracks",
    headers: {"Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
    },
    success: function(tracks) {
      let tracklist = extractAudioFeatures(tracks.items);
      console.log(tracklist);

      let averageValence = calculateAverageValence(tracklist);
      $("#cheerful").append("<h3>" + convertDecimalToPercent(averageValence) + "% Cheerful</h3>");

      let averageDanceability = calculateAverageDanceability(tracklist);
      $("#rhytmic").append("<h3>" + convertDecimalToPercent(averageDanceability) + "% Rhythmic</h3>");

      let averageEnergy = calculateAverageEnergy(tracklist);
      $("#energetic").append("<h3>" + convertDecimalToPercent(averageEnergy) + "% Energetic</p>");

      let mostCheerfulSong = findMostCheerfulSong(tracklist);
      $("#cheerful").append("<p> Your most positive song is " + mostCheerfulSong + "</p>");

      let mostMelancholicSong = findMostMelancholicSong(tracklist);
      $("#cheerful").append("<p> Your most negative song is " + mostMelancholicSong + "</p>");

      let mostDanceableSong = findMostDanceableSong(tracklist);
      $("#rhytmic").append("<p> Your most danceable song is " + mostDanceableSong + "</p>");

      let leastDanceableSong = findLeastDanceableSong(tracklist);
      $("#rhytmic").append("<p> Your least danceable song is " + leastDanceableSong + "</p>");

      let mostEnergeticSong = findMostEnergeticSong(tracklist);
      $("#energetic").append("<p> Your most energetic song is " + mostEnergeticSong + "</p>");

      let leastEnergeticSong = findLeastEnergeticSong(tracklist);
      $("#energetic").append("<p> Your least energetic song is " + leastEnergeticSong + "</p>");

      let loudestSong = findLoudestSong(tracklist);
      $("#loud").append("<p> Your loudest song is " + loudestSong + "</p>");

      let leastLoudSong = findLeastLoudSong(tracklist);
      $("#loud").append("<p> Your least loud song is " + leastLoudSong + "</p>");

      let mostSpeechySong = findMostSpeechySong(tracklist);
      $("#speechy").append("<p> Your most speechy song is " + mostSpeechySong + "</p>");

      let leastSpeechySong = findLeastSpeechySong(tracklist);
      $("#speechy").append("<p> Your least speechy song is " + leastSpeechySong + "</p>");

      for(let i = 0; i < tracklist.length; i += 1) {
        $("#top-tracks").append("<p>" + (i + 1) + '. ' + extractSongNameAndArtists(tracklist[i]) + "</p>");
      }
    }
});

function extractAudioFeatures(tracks) {
  let tracklist = new Array(tracks.length);

  for(let i = 0; i < tracks.length; i += 1) {
    let id = tracks[i].id;
    let name = tracks[i].name;
    let artists = tracks[i].artists;

    $.ajax({
        type: "GET",
        url: "	https://api.spotify.com/v1/audio-features/" + id,
        headers: {"Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
        },
        success: function(audioFeatures) {
          let track = new Track(id, name, artists, audioFeatures.valence, audioFeatures.danceability,
            audioFeatures.energy, audioFeatures.loudness, audioFeatures.speechiness);
          tracklist[i] = track;
        },
        async: false
    });
  }

  return tracklist;
}

function calculateAverageValence(tracklist) {
  let tracksCount = tracklist.length;
  let valenceSum = 0;
  for(let i = 0; i < tracksCount; i += 1) {
    valenceSum += tracklist[i].valence;
  }

  return valenceSum / tracksCount;
}

function calculateAverageDanceability(tracklist) {
  let tracksCount = tracklist.length;
  let danceabilitySum = 0;
  for(let i = 0; i < tracksCount; i += 1) {
    danceabilitySum += tracklist[i].danceability;
  }

  return danceabilitySum / tracksCount;
}

function calculateAverageEnergy(tracklist) {
  let tracksCount = tracklist.length;
  let energySum = 0;
  for(let i = 0; i < tracksCount; i += 1) {
    energySum += tracklist[i].energy;
  }

  return energySum / tracksCount;
}

function findMostCheerfulSong(tracklist) {
  let tracksCount = tracklist.length;
  let maxValence = tracklist[0].valence;
  let mostCheerfulTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].valence > maxValence) {
      maxValence = tracklist[i].valence;
      mostCheerfulTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(mostCheerfulTrack);
}

function findMostMelancholicSong(tracklist) {
  let tracksCount = tracklist.length;
  let minValence = tracklist[0].valence;
  let mostMelancholicTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].valence < minValence) {
      minValence = tracklist[i].valence;
      mostMelancholicTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(mostMelancholicTrack);
}

function findMostDanceableSong(tracklist) {
  let tracksCount = tracklist.length;
  let maxDanceability = tracklist[0].danceability;
  let mostDanceableTrack = tracklist[0]
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].danceability > maxDanceability) {
      maxDanceability = tracklist[i].danceability;
      mostDanceableTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(mostDanceableTrack);
}

function findLeastDanceableSong(tracklist) {
  let tracksCount = tracklist.length;
  let minDanceability = tracklist[0].danceability;
  let leastDanceableTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].danceability < minDanceability) {
      minDanceability = tracklist[i].danceability;
      leastDanceableTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(leastDanceableTrack);
}

function findMostEnergeticSong(tracklist) {
  let tracksCount = tracklist.length;
  let maxEnergy = tracklist[0].energy;
  let mostEnergeticTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].energy > maxEnergy) {
      maxEnergy = tracklist[i].energy;
      mostEnergeticTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(mostEnergeticTrack);
}

function findLeastEnergeticSong(tracklist) {
  let tracksCount = tracklist.length;
  let minEnergy = tracklist[0].energy;
  let leastEnergeticTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].energy < minEnergy) {
      minEnergy = tracklist[i].energy;
      leastEnergeticTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(leastEnergeticTrack);
}

function findLoudestSong(tracklist) {
  let tracksCount = tracklist.length;
  let maxLoudness = tracklist[0].loudness;
  let loudestTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].loudness > maxLoudness) {
      maxLoudness = tracklist[i].loudness;
      loudestTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(loudestTrack);
}

function findLeastLoudSong(tracklist) {
  let tracksCount = tracklist.length;
  let minLoudness = tracklist[0].loudness;
  let leastLoudTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].loudness < minLoudness) {
      minLoudness = tracklist[i].loudness;
      leastLoudTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(leastLoudTrack);
}

function findMostSpeechySong(tracklist) {
  let tracksCount = tracklist.length;
  let maxSpeechiness = tracklist[0].speechiness;
  let mostSpeechyTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].speechiness > maxSpeechiness) {
      maxSpeechiness = tracklist[i].speechiness;
      mostSpeechyTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(mostSpeechyTrack);
}

function findLeastSpeechySong(tracklist) {
  let tracksCount = tracklist.length;
  let minSpeechiness = tracklist[0].speechiness;
  let leastSpeechyTrack = tracklist[0];
  for(let i = 0; i < tracksCount; i += 1) {
    if(tracklist[i].speechiness < minSpeechiness) {
      minSpeechiness = tracklist[i].speechiness;
      leastSpeechyTrack = tracklist[i];
    }
  }

  return extractSongNameAndArtists(leastSpeechyTrack);
}

function extractSongNameAndArtists(track) {
  let song = "<span class='bold'>" + track.name + "</span> by <span class='green'>" + track.artists + "</span>";
  return song;
}

function convertDecimalToPercent(value) {
  return Math.floor(value * 100);
}
