// Select the form and the video player elements
const promptForm = document.querySelector("#prompt-form form");
const videoPlayer1 = document.getElementById("video-player1");
const videoPlayer2 = document.getElementById("video-player2");
const saveButton = document.getElementById("save-reflection");

// Function to handle form submission
promptForm.addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent page reload

  // Collect form data
  const emotionalGoal = document.getElementById("EmotionalGoal").value;
  const developmentArea = promptForm.querySelector(
    '[name="DevelopmentArea"]'
  ).value;
  const lengthOfVideo = promptForm.querySelector(
    '[name="LengthOfVideo"]'
  ).value;
  const countryOfOrigin = promptForm.querySelector(
    '[name="CountryOfOrigin"]'
  ).value;
  const language = promptForm.querySelector('[name="Language"]').value;

  // Create the AI prompt
  const userPrompt = `Generate a JSON object with two YouTube video suggestions based on the following criteria: emotional goal "${emotionalGoal}", development area "${developmentArea}", video length "${lengthOfVideo}" minutes, country of origin "${countryOfOrigin}", and language "${language}". The JSON should have a "videos" array, where each object has a "title" and a "url" key. Ensure the URLs are valid YouTube embed links. Only return the JSON object without any additional text.`;

  try {
    // Prompt goes to server
    const response = await fetch("http://localhost:8833/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: userPrompt }),
    });

    const aiResponseText = await response.json();
    console.log("AI Response:", aiResponseText);

    // Response JSON
    const aiResponseObject = JSON.parse(aiResponseText);
    const videos = aiResponseObject.videos;

    // Insert the video
    if (videos && videos.length >= 2) {
      videoPlayer1.innerHTML = `<iframe width="auto" height="315" src="${videos[0].url.replace(
        "watch?v=",
        "embed/"
      )}" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      videoPlayer2.innerHTML = `<iframe width="auto" height="315" src="${videos[1].url.replace(
        "watch?v=",
        "embed/"
      )}" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    } else {
      console.error("AI response did not contain enough video data.");
    }
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    videoPlayer1.innerHTML = `<p>Failed to load videos. Please try again.</p>`;
    videoPlayer2.innerHTML = `<p>Failed to load videos. Please try again.</p>`;
  }
});
