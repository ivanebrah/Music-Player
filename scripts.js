document.addEventListener("DOMContentLoaded", function() {
    // Get Element By Their IDs
    const playPauseButton = document.getElementById("play-pause");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const volumeControl = document.getElementById("volume");
    const currentTimeDisplay = document.getElementById("current-time");
    const totalDurationDisplay = document.getElementById("total-duration");
    const albumArt = document.getElementById("album-art");
    const progressBar = document.getElementById("progress");
    const shuffleButton = document.getElementById("shuffle");
    const repeatButton = document.getElementById("repeat");
    const lyricsDisplay = document.getElementById("lyrics");

    let isShuffle = false;
    let isRepeat = false;

    // Create a new Audio object
    const audio = new Audio();
    audio.src = "./How You Like Me Now.mp3"; // Default audio source

    // Playlist array containing paths to audio files
    let playlist = [
        {src: "./How You Like Me Now.mp3", art: "How You Like Me Now.jpg"},
        {src: "./Falling World.mp3", art: "Swallow the sun.jpg"},
        {src: "./New Moon.mp3", art: "New Moon.jpg"},
        {src: "./ludovico einaudi experience slowed.mp3", art: "ludovico einaudi experience slowed.jpg"}
    ];

    // Variable to keep track of the current track index
    let currentTrack = 0;

    // Add event listeners to the buttons
    playPauseButton.addEventListener("click", togglePlayPause);
    prevButton.addEventListener("click", playPrevious);
    nextButton.addEventListener("click", playNext);
    shuffleButton.addEventListener("click", toggleShuffle);
    repeatButton.addEventListener("click", toggleRepeat);
    // Add event listener for the volume control
    volumeControl.addEventListener("input", adjustVolume);
    // Update the progress bar and time display during playback
    audio.addEventListener("timeupdate", updateProgress);
    // Add event listener for seeking in the progress bar
    progressBar.addEventListener("click", seek);

    // Function to handle seeking in the audio
    function seek(event) {
        const rect = progressBar.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const width = rect.width;
        const duration = audio.duration;

        const clickPositionRatio = offsetX / width;
        const newTime = duration * clickPositionRatio;

        audio.currentTime = newTime;
    }


    function fetchLyrics(trackName, artistName) {
        // Mock lyrics data for development purposes
        const mockLyrics = `These are the lyrics for ${trackName} by ${artistName}`;
        lyricsDisplay.textContent = mockLyrics;
    }


    // Function to toggle shuffle mode
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleButton.classList.toggle("active", isShuffle);
    }

    // Function to toggle repeat mode
    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle("active", isRepeat);
    }

    // Function to play the next track
    function playNext() {
        if (isShuffle) {
            currentTrack = Math.floor(Math.random() * playlist.length);
        } else {
            currentTrack = isRepeat ? currentTrack : (currentTrack < playlist.length - 1 ? currentTrack + 1 : 0);
        }
        updateTrack();
    }

    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change icon to pause
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Change icon to play
        }
    }
    


    function updateBackground() {
        const backgroundAlbums = document.querySelectorAll('.background-container img');
        backgroundAlbums.forEach((img, index) => {
            img.classList.remove('active');
            if (index === currentTrack) {
                img.classList.add('active');
            }
        });
    }

    // document.getElementById('track-title').textContent = playlist[currentTrack].src.split('/').pop().replace('.mp3', '');
    // document.getElementById('artist-name').textContent = 'Unknown Artist'; 
    // updateBackground(); 



    

    // Function to play the previous track
    function playPrevious() {
        if (currentTrack > 0) {
            currentTrack--; // Move to the previous track in the playlist
            updateTrack();
        }
    }

    // Function to adjust the volume
    function adjustVolume() {
        audio.volume = volumeControl.value;
    }

    function updateProgress() {
        const currentTime = audio.currentTime;
        const duration = audio.duration;
    
        if (isNaN(duration)) {
            totalDurationDisplay.textContent = "0:00";
            return;
        }
    
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(currentTime);
        totalDurationDisplay.textContent = formatTime(duration);
    }
    

    // Function to format time in minutes and seconds
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }


    function updateTrack() {
        const currentTrackData = playlist[currentTrack];
        audio.src = currentTrackData.src;
        albumArt.src = currentTrackData.art;
        audio.load();
    
        // Update track info
        document.getElementById('track-title').textContent = currentTrackData.src.split('/').pop().replace('.mp3', '');
        document.getElementById('artist-name').textContent = 'Unknown Artist'; // Replace with actual artist if available
        updateBackground(); // Update background
    }

    
    // // Function to update the track and fetch lyrics
    // function updateTrack() {
    //     const currentTrackData = playlist[currentTrack];
    //     audio.src = currentTrackData.src;
    //     albumArt.src = currentTrackData.art;
    //     audio.load();
    //     // audio.play();

    //     // Fetch and display lyrics
    //     const trackName = currentTrackData.src.split('/').pop().replace('.mp3', '');
    //     const artistName = 'Unknown Artist'; // Replace with actual artist name if available
    //     fetchLyrics(trackName, artistName);
    // }

    // Set total duration once the metadata is loaded
    audio.addEventListener("loadedmetadata", function () {
        totalDurationDisplay.textContent = formatTime(audio.duration);
    });

    // Initialize the first track
    updateTrack();
});




// document.addEventListener("DOMContentLoaded", function() {
//     const playPauseButton = document.getElementById("play-pause");
//     const audio = new Audio();
//     audio.src = "./How You Like Me Now.mp3"; // Default audio source

//     playPauseButton.addEventListener("click", function() {
//         if (audio.paused) {
//             audio.play();
//             playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
//         } else {
//             audio.pause();
//             playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
//         }
//     });

    // Existing event listeners and functions...
    // playButton, pauseButton, prevButton, nextButton, volumeControl, updateProgress, etc.
// });




    // Function to fetch lyrics from Musixmatch API
    // function fetchLyrics(trackName, artistName) {
    //     const apiKey = 'ACTUAL_API_KEY'; 
    //     const apiUrl = `https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${encodeURIComponent(trackName)}&q_artist=${encodeURIComponent(artistName)}&apikey=${apiKey}`;

    //     fetch(apiUrl, { mode: 'no-cors' })
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
    //             if (data.message.body.lyrics) {
    //                 lyricsDisplay.textContent = data.message.body.lyrics.lyrics_body;
    //             } else {
    //                 lyricsDisplay.textContent = 'Lyrics not found.';
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Error fetching lyrics:', error);
    //             lyricsDisplay.textContent = 'Error fetching lyrics.';
    //         });
    // }



    // Function to update the progress bar and time display
    // function updateProgress() {
    //     const currentTime = audio.currentTime;
    //     const duration = audio.duration;
    //     const progress = (currentTime / duration) * 100;

    //     document.getElementById("progress").value = progress;
    //     currentTimeDisplay.textContent = formatTime(currentTime);
    //     totalDurationDisplay.textContent = formatTime(duration);
    // }



    // document.addEventListener("click", function() {
    //     audio.play();
    //     playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    // });