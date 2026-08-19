import { useEffect, useRef, useState } from "react";
import "./App.css";

const songs = [
  {
    artist: "Billie Eilish",
    title: "WILDFLOWER",
    duration: "4:21",
    audio: "/audio/wildflower.mp3",
    image: "/artists/billie.jpg",
    className: "song-purple",
    symbol: "✦",
  },
  {
    artist: "Travis Scott",
    title: "MY EYES",
    duration: "4:11",
    audio: "/audio/my-eyes.mp3",
    image: "/artists/travis.jpg",
    className: "song-orange",
    symbol: "◉",
  },
  {
    artist: "Harry Styles",
    title: "Sign of the Times",
    duration: "5:41",
    audio: "/audio/sign-of-the-times.mp3",
    image: "/artists/harry.jpg",
    className: "song-yellow",
    symbol: "✺",
  },
  {
    artist: "The Strokes",
    title: "Selfless",
    duration: "3:43",
    audio: "/audio/selfless.mp3",
    image: "/artists/strokes.jpg",
    className: "song-pink",
    symbol: "✦",
  },
];

const artists = [
  {
    name: "Billie Eilish",
    song: "WILDFLOWER",
    image: "/artists/billie.jpg",
  },
  {
    name: "Travis Scott",
    song: "MY EYES",
    image: "/artists/travis.jpg",
  },
  {
    name: "Harry Styles",
    song: "Sign of the Times",
    image: "/artists/harry.jpg",
  },
  {
    name: "The Strokes",
    song: "Selfless",
    image: "/artists/strokes.jpg",
  },
];

const playlists = [
  {
    title: "Late Night",
    subtitle: "12 tracks",
    symbol: "☾",
    className: "playlist-purple",
  },
  {
    title: "Good Energy",
    subtitle: "18 tracks",
    symbol: "✦",
    className: "playlist-orange",
  },
  {
    title: "Indie Hours",
    subtitle: "15 tracks",
    symbol: "◒",
    className: "playlist-blue",
  },
  {
    title: "Soft Mornings",
    subtitle: "21 tracks",
    symbol: "☼",
    className: "playlist-green",
  },
];

function App() {
  const audioRef = useRef(null);

  const [activeSong, setActiveSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likedSongs, setLikedSongs] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activePage, setActivePage] = useState("Home");

  // Account dropdown
  const [accountOpen, setAccountOpen] = useState(false);

  const currentSong = songs[activeSong];

  /* ================= AUDIO ================= */

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.src = currentSong.audio;
    audioRef.current.load();

    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audioRef.current
        .play()
        .catch(() => setIsPlaying(false));
    }
  }, [activeSong]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  /* ================= AUDIO EVENTS ================= */

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSongEnded = () => {
    nextSong();
  };

  /* ================= PLAY SONG ================= */

  const playSong = (index) => {
    setActiveSong(index);
    setIsPlaying(true);

    setRecentSongs((prev) => {
      const updated = [
        index,
        ...prev.filter((item) => item !== index),
      ];

      return updated.slice(0, 4);
    });
  };

  /* ================= PLAY / PAUSE ================= */

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  /* ================= NEXT ================= */

  const nextSong = () => {
    const nextIndex =
      activeSong === songs.length - 1
        ? 0
        : activeSong + 1;

    playSong(nextIndex);
  };

  /* ================= PREVIOUS ================= */

  const previousSong = () => {
    const previousIndex =
      activeSong === 0
        ? songs.length - 1
        : activeSong - 1;

    playSong(previousIndex);
  };

  /* ================= LIKE ================= */

  const toggleLike = (index) => {
    setLikedSongs((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  /* ================= SEARCH ================= */

  const filteredSongs = songs.filter(
    (song) =>
      song.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      song.artist
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* ================= TIME FORMAT ================= */

  const formatTime = (time) => {
    if (!time || isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  /* ================= PROGRESS ================= */

  const progress =
    duration > 0
      ? (currentTime / duration) * 100
      : 0;

  const changeProgress = (e) => {
    if (!audioRef.current || !duration) return;

    const rect =
      e.currentTarget.getBoundingClientRect();

    const clickPosition =
      e.clientX - rect.left;

    const percentage =
      clickPosition / rect.width;

    audioRef.current.currentTime =
      percentage * duration;
  };

  /* ================= SIDEBAR ================= */

  const handleSidebar = (page) => {
    setActivePage(page);

    if (page === "Favorites") {
      document
        .getElementById("songs-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }

    if (page === "Playlists") {
      document
        .getElementById("playlist-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }

    if (page === "Recently Played") {
      document
        .getElementById("recent-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }

    if (page === "Explore") {
      document
        .getElementById("artists-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }

    if (page === "Radio") {
      document
        .getElementById("hero-section")
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }

    if (page === "Home") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="music-app">

      {/* AUDIO */}

      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnded}
      />

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">
          MÚSICA
        </div>

        <div className="sidebar-group">

          <div className="sidebar-title">
            DISCOVER
          </div>

          <button
            className={`sidebar-link ${
              activePage === "Home"
                ? "active"
                : ""
            }`}
            onClick={() => handleSidebar("Home")}
          >
            <span>⌂</span>
            Home
          </button>

          <button
            className={`sidebar-link ${
              activePage === "Explore"
                ? "active"
                : ""
            }`}
            onClick={() => handleSidebar("Explore")}
          >
            <span>◉</span>
            Explore
          </button>

          <button
            className={`sidebar-link ${
              activePage === "Radio"
                ? "active"
                : ""
            }`}
            onClick={() => handleSidebar("Radio")}
          >
            <span>◌</span>
            Radio
          </button>

        </div>

        <div className="sidebar-group">

          <div className="sidebar-title">
            YOUR MUSIC
          </div>

          <button
            className={`sidebar-link ${
              activePage === "Favorites"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSidebar("Favorites")
            }
          >
            <span>♡</span>
            Favorites
          </button>

          <button
            className={`sidebar-link ${
              activePage === "Playlists"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSidebar("Playlists")
            }
          >
            <span>♫</span>
            Playlists
          </button>

          <button
            className={`sidebar-link ${
              activePage === "Recently Played"
                ? "active"
                : ""
            }`}
            onClick={() =>
              handleSidebar("Recently Played")
            }
          >
            <span>◷</span>
            Recently Played
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="profile-mini">

            <div className="profile-avatar">
              D
            </div>

            <div>
              <strong>Dhilara</strong>
              <small>
                Personal collection
              </small>
            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="main-content">

        {/* TOPBAR */}

        <header className="topbar">

          <div className="mobile-logo">
            MÚSICA
          </div>

          <div className="search-container">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search artists, songs..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* ================= ACCOUNT ================= */}

          <div className="top-account">

            <button
              className="top-avatar"
              onClick={() =>
                setAccountOpen(!accountOpen)
              }
              aria-label="Open account"
            >
              D
            </button>

            {accountOpen && (
              <div className="account-dropdown">

                <div className="account-dropdown-avatar">
                  D
                </div>

                <div className="account-dropdown-info">

                  <strong>
                    Dhilara
                  </strong>

                  <span>
                    dhilaramirsa@gmail.com
                  </span>

                </div>

              </div>
            )}

          </div>

        </header>

        {/* ================= HERO ================= */}

        <section
          className="featured"
          id="hero-section"
        >

          <div className="featured-copy">

            <div className="featured-label">
              FEATURED THIS WEEK
            </div>

            <h1>
              Music
              <br />
              <em>your way.</em>
            </h1>

            <p className="featured-description">
              Find the songs that fit your mood.
              Discover artists, save your favorites,
              and let every moment have its own
              soundtrack.
            </p>

            <button
              className="listen-button"
              onClick={() => playSong(0)}
            >
              <span>▶</span>
              Listen now
            </button>

          </div>

          {/* ================= RETRO RADIO ================= */}

          <div className="featured-visual">

            <div className="visual-glow"></div>

            <div className="visual-ring ring-one"></div>

            <div className="visual-ring ring-two"></div>

            <div
              className={`retro-stereo ${
                isPlaying
                  ? "stereo-playing"
                  : ""
              }`}
            >

              <div className="stereo-top"></div>

              <div className="stereo-disc">

                <div className="disc-lines"></div>

                <div className="disc-center">
                  <div className="disc-hole"></div>
                </div>

              </div>

              <div className="stereo-speaker">

                <div className="speaker-ring">
                  <div className="speaker-center"></div>
                </div>

              </div>

              <div className="stereo-lights">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

              </div>

              <div className="stereo-knobs">

                <i></i>
                <i></i>
                <i></i>

              </div>

            </div>

          </div>

        </section>

        {/* ================= PLAYLISTS ================= */}

        <section
          className="content-section"
          id="playlist-section"
        >

          <div className="section-heading">

            <div>

              <small>
                CURATED FOR YOU
              </small>

              <h2>
                Playlists for every mood
              </h2>

            </div>

            <button>
              View all →
            </button>

          </div>

          <div className="playlist-grid">

            {playlists.map(
              (playlist, index) => (

                <button
                  className={`playlist-card ${playlist.className}`}
                  key={playlist.title}
                  onClick={() =>
                    playSong(
                      index % songs.length
                    )
                  }
                >

                  <div className="playlist-symbol">
                    {playlist.symbol}
                  </div>

                  <div className="playlist-info">

                    <strong>
                      {playlist.title}
                    </strong>

                    <span>
                      {playlist.subtitle}
                    </span>

                  </div>

                  <div className="playlist-arrow">
                    →
                  </div>

                </button>

              )
            )}

          </div>

        </section>

        {/* ================= SONGS ================= */}

        <section
          className="content-section"
          id="songs-section"
        >

          <div className="section-heading">

            <div>

              <small>
                YOUR SOUNDTRACK
              </small>

              <h2>
                Trending right now
              </h2>

            </div>

            <button>
              See all →
            </button>

          </div>

          <div className="song-list">

            {filteredSongs.map((song) => {

              const originalIndex =
                songs.indexOf(song);

              return (

                <div
                  className={`song-row ${
                    activeSong ===
                    originalIndex
                      ? "selected"
                      : ""
                  }`}
                  key={song.title}
                >

                  <span className="song-number">
                    {String(
                      originalIndex + 1
                    ).padStart(2, "0")}
                  </span>

                  <div
                    className={`song-cover ${song.className}`}
                    style={{
                      backgroundImage:
                        `url("${song.image}")`,
                    }}
                  >

                    {activeSong ===
                      originalIndex &&
                    isPlaying ? (

                      <div className="mini-equalizer">

                        <i></i>
                        <i></i>
                        <i></i>
                        <i></i>

                      </div>

                    ) : null}

                  </div>

                  <div className="song-name">

                    <strong>
                      {song.title}
                    </strong>

                    <small>
                      {song.artist}
                    </small>

                  </div>

                  <span className="song-time">
                    {song.duration}
                  </span>

                  <button
                    className="heart-button"
                    onClick={() =>
                      toggleLike(
                        originalIndex
                      )
                    }
                  >
                    {likedSongs.includes(
                      originalIndex
                    )
                      ? "♥"
                      : "♡"}
                  </button>

                  <button
                    className="song-play"
                    onClick={() => {

                      if (
                        activeSong ===
                        originalIndex
                      ) {
                        togglePlay();
                      } else {
                        playSong(
                          originalIndex
                        );
                      }

                    }}
                  >
                    {activeSong ===
                      originalIndex &&
                    isPlaying
                      ? "Ⅱ"
                      : "▶"}
                  </button>

                </div>

              );

            })}

          </div>

        </section>

        {/* ================= RECENTLY PLAYED ================= */}

        {recentSongs.length > 0 && (

          <section
            className="content-section"
            id="recent-section"
          >

            <div className="section-heading">

              <div>

                <small>
                  YOUR HISTORY
                </small>

                <h2>
                  Recently played
                </h2>

              </div>

            </div>

            <div className="recent-list">

              {recentSongs.map((index) => {

                const song = songs[index];

                return (

                  <button
                    className="recent-card"
                    key={index}
                    onClick={() =>
                      playSong(index)
                    }
                  >

                    <div
                      className="recent-image"
                      style={{
                        backgroundImage:
                          `url("${song.image}")`,
                      }}
                    ></div>

                    <div>

                      <strong>
                        {song.title}
                      </strong>

                      <small>
                        {song.artist}
                      </small>

                    </div>

                  </button>

                );

              })}

            </div>

          </section>

        )}

        {/* ================= ARTISTS ================= */}

        <section
          className="content-section"
          id="artists-section"
        >

          <div className="section-heading">

            <div>

              <small>
                ARTISTS TO EXPLORE
              </small>

              <h2>
                Meet your favorites
              </h2>

            </div>

            <button>
              Explore artists →
            </button>

          </div>

          <div className="artist-grid">

            {artists.map(
              (artist, index) => (

                <button
                  className="artist-card"
                  key={artist.name}
                  onClick={() =>
                    playSong(index)
                  }
                >

                  <div
                    className="artist-art"
                    style={{
                      backgroundImage:
                        `url("${artist.image}")`,
                    }}
                  >

                    <div className="artist-image-overlay"></div>

                  </div>

                  <div className="artist-info">

                    <strong>
                      {artist.name}
                    </strong>

                    <small>
                      {artist.song}
                    </small>

                  </div>

                </button>

              )
            )}

          </div>

        </section>

      </main>

      {/* ================= BOTTOM PLAYER ================= */}

      <div className="player">

        <div className="player-song">

          <div
            className={`player-cover ${
              isPlaying
                ? "playing"
                : ""
            }`}
            style={{
              backgroundImage:
                `url("${currentSong.image}")`,
            }}
          ></div>

          <div className="player-details">

            <strong>
              {currentSong.title}
            </strong>

            <span>
              {currentSong.artist}
            </span>

          </div>

          <button
            className="player-heart"
            onClick={() =>
              toggleLike(activeSong)
            }
          >
            {likedSongs.includes(
              activeSong
            )
              ? "♥"
              : "♡"}
          </button>

        </div>

        <div className="player-middle">

          <div className="player-controls">

            <button onClick={previousSong}>
              ↶
            </button>

            <button onClick={previousSong}>
              ◀
            </button>

            <button
              className="big-play"
              onClick={togglePlay}
            >
              {isPlaying ? "Ⅱ" : "▶"}
            </button>

            <button onClick={nextSong}>
              ▶
            </button>

            <button onClick={nextSong}>
              ↷
            </button>

          </div>

          <div className="player-progress">

            <span>
              {formatTime(currentTime)}
            </span>

            <div
              className="progress-track"
              onClick={changeProgress}
            >

              <div
                style={{
                  width: `${progress}%`,
                }}
              ></div>

            </div>

            <span>
              {duration
                ? formatTime(duration)
                : currentSong.duration}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;
