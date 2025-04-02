document.addEventListener("DOMContentLoaded", function() {
    // Get Element By Their IDs
    const playPauseButton = document.getElementById("play-pause");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");
    const volumeControl = document.getElementById("volume");
    const currentTimeDisplay = document.getElementById("current-time");
    const totalDurationDisplay = document.getElementById("total-duration");
    const albumArt = document.getElementById("album-art");
    const progressLine = document.getElementById("progress-line");
    const progressThumb = document.getElementById("progress-thumb");
    const progressContainer = document.querySelector('.progress-line-container');
    const shuffleButton = document.getElementById("shuffle");
    const repeatButton = document.getElementById("repeat");
    const lyricsDisplay = document.getElementById("lyrics");

    let isShuffle = false;
    let isRepeat = false;

    // Create a new Audio object
    const audio = new Audio();
    audio.src = "./How You Like Me Now.mp3"; // Default audio source
    audio.preload = "auto"; // Preload audio files

    // Playlist array containing paths to audio files
    let playlist = [
        {src: "./How You Like Me Now.mp3", art: "How You Like Me Now.jpg", artist: "Toby Keith"},
        {src: "./Do I Wanna Know.mp3", art: "Do I Wanna Know.jpg", artist: "Arctic Monkeys"},
        {src: "./Falling World.mp3", art: "Swallow the sun.jpg", artist: "Swallow the sun"},
        {src: "./New Moon.mp3", art: "New Moon.jpg", artist: "Swallow the sun"},
        {src: "./ludovico einaudi experience slowed.mp3", art: "ludovico einaudi experience slowed.jpg", artist: "Ludovico Einaudi"}
    ];

    // Variable to keep track of the current track index
    let currentTrack = 0;

    // Initialize volume control
    audio.volume = volumeControl.value;

    // Add event listeners to the buttons
    playPauseButton.addEventListener("click", togglePlayPause);
    prevButton.addEventListener("click", playPrevious);
    nextButton.addEventListener("click", playNext);
    shuffleButton.addEventListener("click", toggleShuffle);
    repeatButton.addEventListener("click", toggleRepeat);
    volumeControl.addEventListener("input", adjustVolume);
    audio.addEventListener("timeupdate", updateProgress);
    progressContainer.addEventListener("click", seek);
    audio.addEventListener("error", () => {
        alert("Error loading the track. Please check the file path.");
    });

    // Function to handle seeking in the audio
    function seek(event) {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const width = rect.width;

        const clickPositionRatio = clickX / width;
        audio.currentTime = clickPositionRatio * audio.duration; // Set audio playback time
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

    // Function to toggle play/pause
    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; 
        } else {
            audio.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; 
        }
    }

    // Function to play the previous track (loops to last track when at the first one)
    function playPrevious() {
        if (currentTrack === 0) {
            currentTrack = playlist.length - 1;
        } else {
            currentTrack--;
        }
        updateTrack();
    }

    // Function to adjust the volume
    function adjustVolume() {
        audio.volume = volumeControl.value;
    }

    // Function to update the progress line and time displays
    function updateProgress() {
        const currentTime = audio.currentTime;
        const duration = audio.duration;

        if (isNaN(duration)) {
            totalDurationDisplay.textContent = "0:00";
            return;
        }

        const progress = (currentTime / duration) * 100;
        progressLine.style.width = `${progress}%`; 
        progressThumb.style.left = `${progress}%`; 
        currentTimeDisplay.textContent = formatTime(currentTime); 
        totalDurationDisplay.textContent = formatTime(duration); 
    }

    // Function to format time in minutes and seconds
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function updateBackground() {
        
    }

    // Function to update the track information and background
    function updateTrack() {
        const currentTrackData = playlist[currentTrack];
        audio.src = currentTrackData.src;
        albumArt.src = currentTrackData.art;
        audio.load();

        // Update track info inside the phone frame
        document.getElementById('track-title').textContent = currentTrackData.src.split('/').pop().replace('.mp3', '');
        document.getElementById('artist-name').textContent = currentTrackData.artist || "Unknown Artist";

        // Start playing the newly loaded track automatically
        audio.play();
    }

    // Set total duration once the metadata is loaded
    audio.addEventListener("loadedmetadata", function () {
        totalDurationDisplay.textContent = formatTime(audio.duration);
    });

    // Initialize the first track
    updateTrack();

    // Add functionality for animated dots
    document.body.onload = generate;

    function generate() {
        let root = document.documentElement;

        var colors = ["#ff0073", "#450731", "#00eaff", "#06494f", "#ffd240", "#614d0e", "#d9d9d9"],
            total = 150,
            space = 100 / total;

        for (let i = 0; i < total; i++) {
            let dot = document.createElement("div");
            let ind = parseInt(random(colors.length - 1, 0));
            let color = colors[ind];

            dot.className = "dots";
            dot.style.background = color;
            dot.style.boxShadow = `0 0 2px 1px ${color}, 0 0 2px 1px ${color}`;
            dot.style.left = space * i + "%";
            dot.style.animationDelay = random(5, -5) + "s";
            dot.style.animationDuration = random(20, 10) + "s";
            document.body.appendChild(dot);
        }
    }

    function random(max, min) {
        return Math.random() * (max - min + 1) + min;
    }
});


