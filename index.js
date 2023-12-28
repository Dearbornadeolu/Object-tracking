document.addEventListener('DOMContentLoaded', function () {
    // Initialize the video element
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    // Access the user's camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();

            // Once the video is playing, start tracking
            video.addEventListener('playing', function () {
                trackHead();
            });
        })
        .catch(function (err) {
            console.error('Error accessing the camera: ', err);
        });

    function trackHead() {
        // Update canvas size to match video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frames onto the canvas for tracking
        function draw() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(draw);
        }
        draw();

        // Set the willReadFrequently attribute to true for improved performance
        context.canvas.willReadFrequently = true;

        // Perform color-based tracking (replace with a more advanced algorithm for better results)
        function trackColor() {
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var data = imageData.data;
            console.log(data);

            // Example: Track a red color (adjust these values based on your object's color)
            var targetColor = [255, 0, 0];

            // Loop through pixels and find the color match
            for (var i = 0; i < data.length; i += 4) {
                var red = data[i];
                var green = data[i + 1];
                var blue = data[i + 2];

                // Check if the pixel color is close to the target color
                var distance = Math.sqrt(
                    Math.pow(red - targetColor[0], 2) +
                    Math.pow(green - targetColor[1], 2) +
                    Math.pow(blue - targetColor[2], 2)
                );

                // If close, highlight the region
                if (distance < 50) {
                    context.strokeStyle = 'red';
                    context.strokeRect((i / 4) % canvas.width, Math.floor((i / 4) / canvas.width), 1, 1);
                }
            }

            // Call the tracking function recursively
            requestAnimationFrame(trackColor);
        }

        // Start the tracking function
        trackColor();
    }
});
