const storiesContainer = document.getElementById('storiesContainer');
const storyViewer = document.getElementById('storyViewer');
const storyViewerContent = document.getElementById('storyViewerContent');
const storyViewerTitle = document.getElementById('storyViewerTitle');
const progressBar = document.getElementById('progressBar');

let storyQueue = [];
let currentStoryIndex = 0;
let isPaused = false;
let videoElement = null;
let progressStartTime = 0;
let remainingTime = 0;
let cropper;
let finalImage = null; 
let audioElement = null;
let mediaInput = document.getElementById('mediaInput');
let videoPreview = document.getElementById('videoPreview');
let startTimeInput;
let endTimeInput;
let videoTrimControls = document.getElementById('videoTrimControls');

function showStoryPopup() {
    document.getElementById("storyPopup").classList.add("active");
    document.getElementById('previewContainer').classList.add('hidden');
    document.querySelector('.cropper-buttons').classList.add('hidden');
}

function closeStoryPopup() {
    const storyPopup = document.getElementById("storyPopup");
    storyPopup.classList.remove("active");

    const previewContainer = document.getElementById('previewContainer');
    previewContainer.classList.add('hidden');

    const mediaInput = document.getElementById('mediaInput');
    if (mediaInput) {
        mediaInput.value = ''; // Reset media file input
    }

    const audioInput = document.getElementById('audioInput');
    if (audioInput) {
        audioInput.value = ''; // Reset audio file input
    }

    const storyTitle = document.getElementById('storyTitle');
    if (storyTitle) {
        storyTitle.value = ''; // Reset story title input
    }
    finalImage = null; // Clear the stored cropped image
    mediaInput.value = '';
    audioInput.value = '';

    const imageToCrop = document.getElementById('imageToCrop');
    if (imageToCrop) {
        imageToCrop.src = ''; // Ensure the preview image is cleared
    }

    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    document.getElementById('videoPreview').style.display = 'none';
    const videoPreview = document.getElementById('videoPreview');
    document.getElementById('startTime').value = '00:00';
    document.getElementById('endTime').value = '00:05';
    const videoTrimControls = document.getElementById("videoTrimControls");
    videoTrimControls.classList.add("hidden");
    videoPreview.src = null;
    resetCrop();
}

function loadMediaPreview(event) {
    const file = event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        const videoPreview = document.getElementById("videoPreview");
        const previewContainer = document.getElementById('previewContainer');
        const videoTrimControls = document.getElementById("videoTrimControls");

        // Check if the file is an image or video and display accordingly
        if (file.type.startsWith('image/')) {
            const imageToCrop = document.getElementById('imageToCrop');
            imageToCrop.src = e.target.result;
            previewContainer.classList.remove('hidden');
            document.querySelector('.cropper-buttons').classList.remove('hidden');
            document.getElementById('videoPreview').style.display = 'none';
            document.getElementById('imageToCrop').style.display = 'block';
            videoTrimControls.classList.add("hidden");
            initializeCropper();
        } else if (file.type.startsWith('video/')) {
            const videoURL = URL.createObjectURL(file);
            videoPreview.src = videoURL;
            videoPreview.style.display = "block";
            document.getElementById('videoPreview').style.display = 'block';
            document.getElementById('imageToCrop').style.display = 'none';
            document.querySelector('.cropper-buttons').classList.add('hidden');
            const imageToCrop = document.getElementById('imageToCrop');
            if (imageToCrop) {
                imageToCrop.src = ''; // Ensure the preview image is cleared
            }
        
            if (cropper) {
                cropper.destroy();
                cropper = null;
            }
            resetCrop();
            videoTrimControls.classList.remove("hidden");
        } else {
            alert('Unsupported file type.');
        }
    };
    fileReader.readAsDataURL(file);
}

function timeToSeconds(timeStr) {
    const parts = timeStr.split(":").map(Number);
    return parts[0] * 60 + parts[1];
}

function trimVideo() {
    const videoPreview = document.getElementById("videoPreview");
    selectedStartTime = timeToSeconds(document.getElementById("startTime").value) || 0;
    selectedEndTime = timeToSeconds(document.getElementById("endTime").value) || 0;
    startTimeInput = selectedStartTime;
    endTimeInput = selectedEndTime;

    if (isNaN(selectedStartTime) || isNaN(selectedEndTime) || selectedStartTime >= selectedEndTime || selectedEndTime === 0 || selectedEndTime >= videoPreview.duration || selectedStartTime >= videoPreview.duration) {
        document.getElementById('startTime').value = '00:00';
        document.getElementById('endTime').value = '00:05';
        alert("Please enter valid start and end times.");
        return;
    }

    videoPreview.currentTime = selectedStartTime;
    videoPreview.play();
    
    videoPreview.addEventListener("timeupdate", function () {
        if (videoPreview.currentTime >= selectedEndTime) {
            videoPreview.pause();
        }
    });
}


function initializeCropper() {
    const imageToCrop = document.getElementById('imageToCrop');
    if (cropper) cropper.destroy(); // Clean up any existing cropper instance
    cropper = new Cropper(imageToCrop, {
        aspectRatio: NaN,
        viewMode: 2,
    });
}

function cropImage() {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    const croppedImage = canvas.toDataURL(); // Save the cropped image as Data URL

    const imageToCrop = document.getElementById('imageToCrop');
    imageToCrop.src = croppedImage;

    finalImage = croppedImage; // Save the cropped image for story addition
    cropper.destroy();
    cropper = null;

    document.querySelector('.cropper-buttons').classList.add('hidden');
}

function resetCrop() {
    if (cropper) {
        cropper.reset();
    }
    const imageToCrop = document.getElementById('imageToCrop');
    imageToCrop.src = ''; 
}

function addStories() {
    const mediaInput = document.getElementById('mediaInput');
    const storyTitleInput = document.getElementById('storyTitle');
    const files = Array.from(mediaInput.files);
    const storyTitle = storyTitleInput.value.trim() || "Untitled Story";
    const videoPreview = document.getElementById("videoPreview");
    const storyViewerContent = document.getElementById("storyViewerContent");

    if (finalImage === null && files.length === 0) {
        alert('Please select at least one image or video.');
        return;
    }

    const confirmCreation = confirm("Are you sure you want to create this story?");
    if (!confirmCreation) {
        return;
    }

    files.forEach((file) => {
        const storyElement = document.createElement('div');
        storyElement.classList.add('story');
        const audioFile = audioInput.files[0];
        let audioUrl = null;

        if (finalImage && file.type.startsWith('image/')) {
            // Use the cropped image if available
            const img = document.createElement('img');
            img.src = finalImage;
            storyElement.appendChild(img);
            // Handle audio
            if (audioFile) {
                audioUrl = URL.createObjectURL(audioFile);
            }
        } else if (file.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.currentTime = startTimeInput;
            video.duration = endTimeInput - startTimeInput;
            video.controls = false;
            storyElement.appendChild(video);

            if (audioFile) {
                audioUrl = URL.createObjectURL(audioFile);
                video.onloadedmetadata = () => {
                    audioElement.currentTime = 0;
                };
            }


        } else {
            alert('Unsupported file type.');
            return;
        }

        const storyData = {
            src: finalImage || URL.createObjectURL(file),
            audio: audioUrl,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            title: storyTitle,
            reactions: { like: 0, love: 0, laugh: 0 },
            startTime: startTimeInput,
            endTime: endTimeInput  
        };

        storyQueue.push(storyData);

        storyElement.addEventListener('click', () => {
            currentStoryIndex = storyQueue.findIndex(item => item.src === storyData.src);
            showStory(currentStoryIndex);
        });

        storiesContainer.appendChild(storyElement);
    });

    // Reset inputs
    storyTitleInput.value = '';
    mediaInput.value = '';
    finalImage = null;
    audioInput.value = '';
    resetCrop();
    closeStoryPopup();
}

function addReaction(storyIndex, reaction) {
    // Increment the reaction count for the specific story
    storyQueue[storyIndex].reactions[reaction]++;
    updateReactionsDisplay(storyIndex);
}

function updateReactionsDisplay(storyIndex) {
    const reactions = storyQueue[storyIndex].reactions;
    const storyElement = storiesContainer.children[storyIndex];

    const likeCount = storyElement.querySelector('.likeCount');
    const loveCount = storyElement.querySelector('.loveCount');
    const laughCount = storyElement.querySelector('.laughCount');

    // Update the reaction counts on the story viewer
    const storyViewerReactions = storyViewerContent.querySelector('.reactions');
    const viewerLikeCount = storyViewerReactions.querySelector('.likeCount');
    const viewerLoveCount = storyViewerReactions.querySelector('.loveCount');
    const viewerLaughCount = storyViewerReactions.querySelector('.laughCount');

    viewerLikeCount.textContent = reactions.like;
    viewerLoveCount.textContent = reactions.love;
    viewerLaughCount.textContent = reactions.laugh;
}

function showStory(index) {
    if (index < 0 || index >= storyQueue.length) {
        closeStoryViewer();
        return;
    }

    currentStoryIndex = index;
    const story = storyQueue[index];
    storyViewerContent.innerHTML = '';

    resetProgressBar();

    const titleElement = document.createElement('h2'); // Create an <h2> element for the title
    titleElement.textContent = story.title; // Set the title text
    titleElement.classList.add('story-viewer-title'); // Optionally add a class for styling
    storyViewerContent.appendChild(titleElement); // Append the title to the viewer content

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.classList.add('close-button');
    closeButton.addEventListener('click', () => {
        closeStoryViewer();
        cumulativeElapsedTime = 0;
        progressTimeout = 0; 
        isPaused = false;
    });
    storyViewerContent.appendChild(closeButton);

    const pauseButton = document.createElement('button');
    pauseButton.textContent = '❚❚';
    pauseButton.classList.add('pause-button');
    pauseButton.addEventListener('click', togglePause);
    storyViewerContent.appendChild(pauseButton);
    
    if (story.type === 'image') {
        const img = document.createElement('img');
        img.src = story.src;
        storyViewerContent.appendChild(img);
        startProgressBar(5000);
    } else if (story.type === 'video') {
        videoElement = document.createElement('video');
        videoElement.src = story.src;
        videoElement.autoplay = true;
        videoElement.controls = false;
        storyViewerContent.appendChild(videoElement);
        videoElement.currentTime = story.startTime;
    
        videoElement.onloadedmetadata = () => startProgressBar((story.endTime - story.startTime) * 1000);
    }
    

    if (story.audio) {
        if (audioElement) {
            audioElement.pause(); // Pause the previous audio if a new audio is to play
            audioElement.currentTime = 0; // Reset previous audio to start
        }

        audioElement = document.createElement('audio');
        audioElement.src = story.audio;
        audioElement.autoplay = true;
        storyViewerContent.appendChild(audioElement);
        createVolumeControl();
    }
    
    const reactionsContainer = document.createElement('div');
    reactionsContainer.classList.add('reactions');

    const likeButton = document.createElement('button');
    likeButton.textContent = '👍';
    likeButton.addEventListener('click', () => {
        addReaction(index, 'like');
    });
    reactionsContainer.appendChild(likeButton);

    const likeCount = document.createElement('span');
    likeCount.classList.add('likeCount');
    likeCount.textContent = story.reactions.like;
    reactionsContainer.appendChild(likeCount);

    const loveButton = document.createElement('button');
    loveButton.textContent = '❤️';
    loveButton.addEventListener('click', () => {
        addReaction(index, 'love');
    });
    reactionsContainer.appendChild(loveButton);

    const loveCount = document.createElement('span');
    loveCount.classList.add('loveCount');
    loveCount.textContent = story.reactions.love;
    reactionsContainer.appendChild(loveCount);

    const laughButton = document.createElement('button');
    laughButton.textContent = '😂';
    laughButton.addEventListener('click', () => {
        addReaction(index, 'laugh');
    });
    reactionsContainer.appendChild(laughButton);

    const laughCount = document.createElement('span');
    laughCount.classList.add('laughCount');
    laughCount.textContent = story.reactions.laugh;
    reactionsContainer.appendChild(laughCount);

    storyViewerContent.appendChild(reactionsContainer);

    const commentSection = document.createElement('div');
    commentSection.classList.add('comment-section');

    const commentTextbox = document.createElement('textarea');
    commentTextbox.placeholder = 'Add a comment...';
    commentTextbox.classList.add('comment-textbox');
    commentTextbox.addEventListener('focus', () => {
        if (!isPaused) {
            togglePause(true);
        } else {
        }
        commentTextbox.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                if (event.shiftKey) {
                    return;
                } else {
                    event.preventDefault();
                    commentTextbox.value = ''; 
                }
            }
        });
        
    });
    commentTextbox.addEventListener('blur', () => {
        const pauseButton = document.querySelector('.pause-button');
        pauseButton.disabled = false;
        togglePause(false);
        
    });
    commentSection.appendChild(commentTextbox);

    const sendButton = document.createElement('button');
    sendButton.classList.add('send-button');
    const sendIcon = document.createElement('span');
    sendIcon.classList.add('send-icon');
    sendIcon.innerHTML = '➤'; // You can replace with an actual icon or image
    sendButton.appendChild(sendIcon);
    sendButton.addEventListener('click', () => {
        const commentText = commentTextbox.value.trim();
        commentTextbox.value = ''; // Clear the textbox after sending
    });
    commentSection.appendChild(sendButton);

    storyViewerContent.appendChild(commentSection);

    createNavigationButtons(index);
    storyViewer.classList.add('active');
}

function closeStoryViewer() {
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
    }
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
    isPaused = false;
    clearTimeout(progressTimeout);
    storyViewer.classList.remove('active');
}

function startProgressBar(duration) {
    clearTimeout(progressTimeout);
    progressStartTime = Date.now();
    remainingTime = duration;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    requestAnimationFrame(() => {
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';
        progressTimeout = setTimeout(nextStory, duration);
    });
}

let cumulativeElapsedTime = 0; // Track total time elapsed across multiple pauses
let progressTimeout; // To store the timeout and clear it when pausing

function togglePause() {
    isPaused = !isPaused;
    const pauseButton = document.querySelector('.pause-button');

    if (isPaused) {
        // When paused, calculate how much time has passed since the last progress start
        const elapsedTime = Date.now() - progressStartTime;
        cumulativeElapsedTime += elapsedTime; // Add this time to the cumulative elapsed time
        remainingTime -= elapsedTime; // Deduct from remaining time

        // Stop the progress bar (no transition), and set the width to the current progress.
        progressBar.style.transition = 'none';
        progressBar.style.width = `${(cumulativeElapsedTime / (cumulativeElapsedTime + remainingTime)) * 100}%`;

        if (audioElement) {
            audioElement.pause();
        }

        if (videoElement) {
            videoElement.pause();
            if (audioElement) {
                audioElement.pause();
            }
        }

        // Clear the timeout to stop the story from advancing
        clearTimeout(progressTimeout);

        pauseButton.textContent = '▶'; // Change the button to show play
    } else {
        // When resumed, update the start time and resume the progress bar
        progressStartTime = Date.now(); // Reset the start time for resumed progress

        progressBar.style.transition = `width ${remainingTime}ms linear`;
        progressBar.style.width = '100%'; // Transition to 100% over the remaining time

        // Set a new timeout based on the remaining time
        progressTimeout = setTimeout(nextStory, remainingTime);

        if (audioElement) {
            audioElement.play();
        }

        if (videoElement) {
            videoElement.play();
            if (audioElement) {
                audioElement.play();
            }
        }

        pauseButton.textContent = '❚❚'; // Change the button to show pause
    }
}

function nextStory() {
    if (currentStoryIndex < storyQueue.length - 1) {
        showStory(currentStoryIndex + 1);
        cumulativeElapsedTime = 0;
        progressTimeout = 0;
        isPaused = false;
    } else {
        closeStoryViewer();
        cumulativeElapsedTime = 0;
        progressTimeout = 0;
        isPaused = false;
    }
}

function createVolumeControl() {
    if (!audioElement) return;

    const volumeControlContainer = document.createElement('div');
    volumeControlContainer.classList.add('volume-control-container');

    const volumeLabel = document.createElement('span');
    volumeLabel.textContent = '♬';
    volumeLabel.classList.add('volume-label');

    const volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.min = 0;
    volumeControl.max = 1;
    volumeControl.step = 0.01;
    volumeControl.value = audioElement.volume; // Sync with current volume

    volumeControl.addEventListener('input', (event) => {
        audioElement.volume = event.target.value;
    });

    volumeControlContainer.appendChild(volumeLabel);
    volumeControlContainer.appendChild(volumeControl);
    
    // Append to the story viewer only if audio is present
    storyViewerContent.appendChild(volumeControlContainer);
}

function createNavigationButtons(index) {
    // Create the navigation buttons for left and right
    const leftButton = document.createElement('button');
    leftButton.textContent = '<';
    leftButton.classList.add('nav-arrow-left');
    leftButton.disabled = index === 0; // Disable the left button if it's the first story
    leftButton.addEventListener('click', () => {
        showStory(index - 1);
        cumulativeElapsedTime = 0;
        progressTimeout = 0; 
        isPaused = false;
    });

    const rightButton = document.createElement('button');
    rightButton.textContent = '>';
    rightButton.classList.add('nav-arrow-right');
    rightButton.disabled = index === storyQueue.length - 1; // Disable the right button if it's the last story
    rightButton.addEventListener('click', () => {
        showStory(index + 1);
        cumulativeElapsedTime = 0;
        progressTimeout = 0; 
        isPaused = false;
    });

    // If it's the first or last story, hide the opposite arrow
    if (index === 0) {
        leftButton.style.display = 'none'; // Hide left button for the first story
    }
    if (index === storyQueue.length - 1) {
        rightButton.style.display = 'none'; // Hide right button for the last story
    }

    // Append the buttons to the viewer
    storyViewerContent.appendChild(leftButton);
    storyViewerContent.appendChild(rightButton);
}

function resetProgressBar() {
    clearTimeout(progressTimeout); // Clear any ongoing progress timeout
    progressStartTime = 0; // Reset start time
    remainingTime = 0; // Reset remaining time
    progressBar.style.transition = 'none'; // Remove transition for instant reset
    progressBar.style.width = '0%'; // Reset the progress bar to 0
}

function addAudioToStory(audioFile, storyElement) {
    const audioURL = URL.createObjectURL(audioFile);
    const audioElement = document.createElement('audio');
    audioElement.src = audioURL;
    audioElement.autoplay = true;
    audioElement.loop = true; // Loop the audio if needed
    storyElement.appendChild(audioElement);
}

