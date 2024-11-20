document.addEventListener("DOMContentLoaded", function() {
    var aiEnabled = false;
    var progress = 25; // Starts at 25%
    var progressFill = document.getElementById("progress-fill");
    var progressText = document.getElementById("progress-text");
    var toggleAIButton = document.getElementById("toggle-ai");
    var fractalCanvas = document.getElementById("fractal-canvas");
    var ctx = fractalCanvas.getContext("2d");
    var debugInfo = document.getElementById("debug-info");
    var aiState = null; // "pause" or "press"
    var aiTimer = null;
    var aiStartTime = null;
    var aiDuration = null;
    var aiInterval = null;
    var keys = document.querySelectorAll(".key");
    var lastUpdateTime = Date.now();
    var currentTone = null; // To keep track of the tone being played

    // Variables for fractal drawing
    var fractalBranches = []; // Array to store branches
    var maxDepth = 24; // Maximum depth of recursion

    // Robot elements
    var robot = document.getElementById("robot");
    var mouth = document.getElementById("mouth");
    var leftArm = document.getElementById("left-arm");
    var rightArm = document.getElementById("right-arm");
    var leftEye = document.getElementById("left-eye");
    var rightEye = document.getElementById("right-eye");

    // Variables for progress bar text
    var verbs = ["accessing", "selecting", "pressing", "dialing", "navigating", "choosing", "inputting", "entering", "requesting", "retrieving", "processing", "connecting", "verifying", "authorizing", "confirming", "transferring", "listening", "waiting", "calculating", "loading"];
    var companies = ["Comcast", "Best Buy", "Your Healthcare Provider", "Comcast", "Xfinity", "Verizon", "Bank Of America", "Visa", "Tesla Customer Support", "Spirit Airlines"];
    var nouns = ["account number", "date of birth", "social security number", "password", "customer service", "billing information", "technical support", "operator", "main menu", "voice recognition"];

    var selectedCompany = null;

    // Counter for AI button presses
    var aiPressCount = 0; // Counter for AI button presses

    // Flag to indicate flurry mode
    var inFlurryMode = false;

    // Initialize robot with sad face on page load
    makeRobotSad();

    // Adjust canvas size to match its displayed size
    function resizeCanvas() {
        fractalCanvas.width = fractalCanvas.clientWidth;
        fractalCanvas.height = fractalCanvas.clientHeight;
        // Redraw fractal if needed
        redrawFractal();
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // Initial call

    toggleAIButton.addEventListener("click", function() {
        aiEnabled = !aiEnabled;
        if (aiEnabled) {
            // Change button to "Disable AI", red color, stop wiggle animation
            toggleAIButton.textContent = "Disable AI";
            toggleAIButton.style.backgroundColor = "red";
            toggleAIButton.style.animation = "none";
            // Show fractal canvas
            fractalCanvas.style.display = "block";
            // Clear the fractal canvas
            ctx.clearRect(0, 0, fractalCanvas.width, fractalCanvas.height);
            fractalBranches = []; // Reset branches
            // Start AI simulation
            startAISimulation();
            // Make robot happy
            makeRobotHappy();
            // Randomly select a company for the AI session
            selectedCompany = companies[Math.floor(Math.random() * companies.length)];
        } else {
            // Change button to "Enable AI", green color, start wiggle animation
            toggleAIButton.textContent = "Enable AI";
            toggleAIButton.style.backgroundColor = "green";
            toggleAIButton.style.animation = "wiggle 1s infinite";
            // Hide fractal canvas
            fractalCanvas.style.display = "none";
            // Stop AI simulation
            stopAISimulation();
            // Reset progress
            progress = 25;
            updateProgressBar();
            // Clear fractal canvas
            ctx.clearRect(0, 0, fractalCanvas.width, fractalCanvas.height);
            fractalBranches = []; // Reset branches
            // Make robot sad
            makeRobotSad();
            // Reset company
            selectedCompany = null;
            // Reset progress text
            progressText.textContent = "AI Navigating Phone Tree.";
        }
    });

    function startAISimulation() {
        aiState = null;
        lastUpdateTime = Date.now();
        aiNextState();
        aiInterval = setInterval(updateProgressBar, 100);
        debugInfo.textContent = "AI simulation started";
    }

    function stopAISimulation() {
        clearTimeout(aiTimer);
        clearInterval(aiInterval);
        debugInfo.textContent = "AI simulation stopped";
    }

    function aiNextState() {
        if (!aiEnabled) return;

        // Check if it's time for a flurry press
        if (aiPressCount >= 10) {
            aiPressCount = 0; // Reset the counter

            // 50% chance to perform a flurry press
            if (Math.random() < 0.5) {
                inFlurryMode = true; // Enter flurry mode
                makeRobotBigSmile(); // Robot displays BIG smile
                performFlurryPress();
                return; // Exit the function to prevent further state changes during flurry
            }
        }

        if (aiState === "pause" || aiState === null) {
            // Transition to "press" state
            aiState = "press";
            aiStartTime = Date.now();

            // Determine press duration
            aiDuration = Math.random() < 1/20 ? 2000 : getRandom(100, 500);

            // Randomly select a button
            var randomKey = keys[Math.floor(Math.random() * keys.length)];

            // Simulate button press
            simulateButtonPress(randomKey, aiDuration);

            aiPressCount++; // Increment the press counter

            debugInfo.textContent = "AI pressing key '" + randomKey.textContent.trim() + "' for " + aiDuration + " ms";

            aiTimer = setTimeout(aiNextState, aiDuration);
        } else if (aiState === "press") {
            // Transition to "pause" state
            aiState = "pause";
            aiStartTime = Date.now();

            // Determine pause duration
            aiDuration = Math.random() < 1/20 ? 2000 : getRandom(100, 500);

            debugInfo.textContent = "AI pausing for " + aiDuration + " ms";

            aiTimer = setTimeout(aiNextState, aiDuration);
        }
    }

    // Function to perform the flurry press
    function performFlurryPress() {
        var flurryCount = 0;
        var useLeftHand = false; // Start with right hand

        function flurryPress() {
            if (flurryCount < 10) {
                var randomKey = keys[Math.floor(Math.random() * keys.length)];
                simulateButtonPress(randomKey, 100, useLeftHand); // 0.1 second duration

                aiPressCount++; // Increment the press counter during flurry
                flurryCount++;

                debugInfo.textContent = "AI flurry pressing key '" + randomKey.textContent.trim() + "'";

                // Alternate hands
                useLeftHand = !useLeftHand;

                setTimeout(flurryPress, 100); // Next press after 0.1 seconds
            } else {
                // After flurry, proceed to next state
                inFlurryMode = false; // Exit flurry mode
                makeRobotHappy(); // Return to normal happy face
                aiState = "pause";
                aiDuration = Math.random() < 1/20 ? 2000 : getRandom(100, 500);
                aiTimer = setTimeout(aiNextState, aiDuration);
            }
        }

        flurryPress(); // Start the flurry presses
    }

    function updateProgressBar() {
        if (!aiEnabled) return;

        var now = Date.now();
        var deltaTime = now - lastUpdateTime; // in milliseconds

        var deltaProgress = (deltaTime / 1000) * (aiState === "press" ? 1 : -1);

        progress += deltaProgress;
        if (progress > 100) progress = 100;
        if (progress < 0) progress = 0;

        progressFill.style.width = progress + "%";

        lastUpdateTime = now;
    }

    function simulateButtonPress(button, duration, useLeftHand = false) {
        // Show button animation
        button.classList.add("pressed");

        // Play touch-tone sound
        var tone = playTone(button.textContent.trim());

        // Generate fractal branch with duration
        addFractalBranch(duration);

        if (aiEnabled) {
            // Move robot arm to button
            if (useLeftHand) {
                moveRobotArmToButton(button, "left");
            } else {
                moveRobotArmToButton(button, "right");
            }

            // Start eye animation
            animateEyes(duration);
        }

        // Update progress text with random verb and noun
        var verb = verbs[Math.floor(Math.random() * verbs.length)];
        var noun = nouns[Math.floor(Math.random() * nouns.length)];
        if (selectedCompany === null) {
            selectedCompany = companies[Math.floor(Math.random() * companies.length)];
        }
        progressText.textContent = "AI Navigating phone tree: " + capitalizeFirstLetter(verb) + " " + selectedCompany + " " + noun;

        setTimeout(function() {
            button.classList.remove("pressed");
            tone.stop();
            if (aiEnabled) {
                // Reset robot arm position
                resetRobotArm(useLeftHand ? "left" : "right");
                // Reset eyes
                resetEyes();
            }
        }, duration);
    }

    function playTone(key) {
        // Implement touch-tone sounds using Web Audio API
        var frequencies = getDTMFFrequencies(key);
        if (!frequencies) return {
            stop: function() {}
        };

        var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        var oscillator1 = audioCtx.createOscillator();
        var oscillator2 = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();

        oscillator1.frequency.value = frequencies[0];
        oscillator2.frequency.value = frequencies[1];

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator1.start();
        oscillator2.start();

        // Return an object with a stop function
        return {
            stop: function() {
                oscillator1.stop();
                oscillator2.stop();
                audioCtx.close();
            }
        };
    }

    function getDTMFFrequencies(key) {
        var dtmf = {
            '1': [697, 1209],
            '2': [697, 1336],
            '3': [697, 1477],
            '4': [770, 1209],
            '5': [770, 1336],
            '6': [770, 1477],
            '7': [852, 1209],
            '8': [852, 1336],
            '9': [852, 1477],
            '*': [941, 1209],
            '0': [941, 1336],
            '#': [941, 1477]
        };
        return dtmf[key];
    }

    // Fractal functions
    function addFractalBranch(duration) {
        if (fractalBranches.length === 0) {
            // Start with initial branch
            var startX = fractalCanvas.width / 2;
            var startY = fractalCanvas.height;
            var length = getRandom(15, 25); // Adjusted length to half
            var angle = -90; // Straight up
            var depth = 1; // Start depth
            var branch = {
                x: startX,
                y: startY,
                angle: angle,
                depth: depth
            };
            fractalBranches.push(branch);
            drawBranch(branch, null, duration);
        } else {
            // Add new branch to a random existing endpoint
            var endpoints = fractalBranches.filter(function(branch) {
                return branch.depth < maxDepth;
            });

            if (endpoints.length === 0) {
                debugInfo.textContent = "Maximum fractal depth reached";
                return;
            }

            var parentBranch = endpoints[Math.floor(Math.random() * endpoints.length)];
            var length = getRandom(15, 25); // Adjusted length to half
            var angleDeviation = getRandom(-15, 15);
            var newAngle = parentBranch.angle + angleDeviation;
            var rad = newAngle * Math.PI / 180;
            var newX = parentBranch.x + length * Math.cos(rad);
            var newY = parentBranch.y + length * Math.sin(rad);

            var newBranch = {
                x: newX,
                y: newY,
                angle: newAngle,
                depth: parentBranch.depth + 1,
                parent: parentBranch // Keep track of parent
            };
            fractalBranches.push(newBranch);
            drawBranch(parentBranch, newBranch, duration);
        }
    }

    function drawBranch(parent, child, duration) {
        ctx.beginPath();
        if (child) {
            // Draw from parent to child
            ctx.moveTo(parent.x, parent.y);
            ctx.lineTo(child.x, child.y);
        } else {
            // Draw initial branch
            ctx.moveTo(parent.x, parent.y);
            var rad = parent.angle * Math.PI / 180;
            var newX = parent.x + getRandom(15, 25) * Math.cos(rad); // Adjusted length to half
            var newY = parent.y + getRandom(15, 25) * Math.sin(rad); // Adjusted length to half
            ctx.lineTo(newX, newY);
            parent.x = newX;
            parent.y = newY;
        }

        // Color based on duration
        var maxDuration = 2000; // Max duration in ms
        var minDuration = 100;  // Min duration in ms
        var ratio = (duration - minDuration) / (maxDuration - minDuration);
        if (ratio > 1) ratio = 1;
        if (ratio < 0) ratio = 0;
        var hue = (240 - 240 * ratio); // 240 (blue) to 0 (red)
        ctx.strokeStyle = 'hsl(' + hue + ', 100%, 50%)';

        ctx.stroke();
    }

    function redrawFractal() {
        // Clear the canvas
        ctx.clearRect(0, 0, fractalCanvas.width, fractalCanvas.height);

        // Redraw all branches
        for (var i = 0; i < fractalBranches.length; i++) {
            var branch = fractalBranches[i];
            if (branch.parent) {
                drawBranch(branch.parent, branch, 500); // Use default duration for color
            } else {
                drawBranch(branch, null, 500);
            }
        }
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Robot Functions
    function makeRobotHappy() {
        // Change mouth to smile
        mouth.setAttribute("d", "M85,45 Q100,65 115,45");
    }

    function makeRobotSad() {
        // Change mouth to frown
        mouth.setAttribute("d", "M85,55 Q100,35 115,55");
    }

    function makeRobotBigSmile() {
        // Change mouth to BIG smile
        mouth.setAttribute("d", "M85,40 Q100,80 115,40");
    }
// Adjusted moveRobotArmToButton function
function moveRobotArmToButton(button, arm = "right") {
    // Get button position
    var buttonRect = button.getBoundingClientRect();
    var robotRect = robot.getBoundingClientRect();

    // Calculate positions relative to the robot SVG
    var targetX = buttonRect.left + buttonRect.width / 2 - robotRect.left;
    var targetY = buttonRect.top + buttonRect.height / 2 - robotRect.top;

    // Adjust for scaling
    var robotScaleX = robotRect.width / 200; // Assuming viewBox width is 200
    var robotScaleY = robotRect.height / 200; // Assuming viewBox height is 200
    targetX = targetX / robotScaleX;
    targetY = targetY / robotScaleY;

    if (arm === "left") {
        // Update left arm
        leftArm.setAttribute("x2", targetX);
        leftArm.setAttribute("y2", targetY);
    } else {
        // Update right arm
        rightArm.setAttribute("x2", targetX);
        rightArm.setAttribute("y2", targetY);
    }
}

    function resetRobotArm(arm = "right") {
        if (arm === "left") {
            // Reset left arm to default position
            leftArm.setAttribute("x2", 30);
            leftArm.setAttribute("y2", 80);
        } else {
            // Reset right arm to default position
            rightArm.setAttribute("x2", 170);
            rightArm.setAttribute("y2", 80);
        }
    }

    // Eye Animation
    function animateEyes(duration) {
        var startTime = Date.now();

        function updateEyes() {
            var elapsed = Date.now() - startTime;
            var scale = 1 + (elapsed / duration) * 0.5; // Increase size up to 1.5x
            if (scale > 1.5) scale = 1.5;

            leftEye.setAttribute("transform", "translate(" + (85 * (1 - scale)) + " " + (35 * (1 - scale)) + ") scale(" + scale + " " + scale + ")");
            rightEye.setAttribute("transform", "translate(" + (115 * (1 - scale)) + " " + (35 * (1 - scale)) + ") scale(" + scale + " " + scale + ")");

            if (elapsed < duration) {
                requestAnimationFrame(updateEyes);
            }
        }
        requestAnimationFrame(updateEyes);
    }

    function resetEyes() {
        leftEye.setAttribute("transform", "");
        rightEye.setAttribute("transform", "");
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Keypad button press visual effect and touch-tone sounds
    keys.forEach(function(key) {
        var tone = null;
        key.addEventListener("mousedown", function() {
            key.classList.add("pressed");
            var keyText = key.textContent.trim();
            tone = playTone(keyText);
            debugInfo.textContent = "Playing tone for key: " + keyText;

            // Generate fractal branch with default duration
            addFractalBranch(500);

            if (aiEnabled) {
                // Move robot arm to button
                moveRobotArmToButton(key);

                // Start eye animation (Assuming a default duration)
                animateEyes(500);
            }
        });
        key.addEventListener("mouseup", function() {
            key.classList.remove("pressed");
            if (tone) {
                tone.stop();
                tone = null;
            }
            if (aiEnabled) {
                // Reset robot arm
                resetRobotArm();
                // Reset eyes
                resetEyes();
            }
        });
        key.addEventListener("mouseleave", function() {
            key.classList.remove("pressed");
            if (tone) {
                tone.stop();
                tone = null;
            }
            if (aiEnabled) {
                // Reset robot arm
                resetRobotArm();
                // Reset eyes
                resetEyes();
            }
        });
    });
});
