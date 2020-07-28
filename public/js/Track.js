class Track {
  id;
  name;
  artists;
  valence;
  danceability;
  energy;
  loudness;
  speechiness;

  constructor(id, name, artists, valence, danceability, energy, loudness, speechiness) {
    this.id = id;
    this.name = name;

    this.artists = "";
    for(let i = 0; i < artists.length; i += 1) {
      this.artists += artists[i].name + ", ";
    }
    this.artists = this.artists.replace(/,\s*$/, "");

    this.valence = valence;
    this.danceability = danceability;
    this.energy = energy;
    this.loudness = loudness;
    this.speechiness = speechiness;
  }
}
