# Interactive AI Lab Scenarios

## Part 1: Linear Regression (Predicting Numbers)

### 1. The Smart Greenhouse

**The Challenge:** Figure out how much a crop will yield based on the daily sunlight and water it receives.

**The Data:**
- **Perfect Data:** Clean, daily logs showing steady, predictable growth.
- **Tiny Data:** Only five days of logs, leaving the AI with too little history to learn from.
- **Messy Data:** Broken sensors that record impossible things, like 10,000 hours of sunlight in a single day.

**The Takeaway:** Linear regression is great at finding trends, but extreme outliers or a lack of history can completely throw off its predictions.

**Try It Out:** Measure your own potted plant's sunlight and water for a week, and see if the AI can guess how tall it will get on day eight.

---

### 2. The Paper Plane Lab

**The Challenge:** Predict how far a paper airplane will fly based on its wingspan and weight.

**The Data:**
- **Perfect Flights:** Throws done indoors with zero wind.
- **The Windy Day:** Outdoor throws where sudden gusts of wind create confusing, random results.
- **Cardboard Only:** A biased dataset that only includes really heavy paper planes.

**The Takeaway:** AI struggles with "extrapolation." If you only teach it about heavy cardboard planes, it will fail miserably when asked to predict the flight of a light origami plane.

**Try It Out:** Fold a few different planes, throw them down the hallway, measure the distance, and challenge the AI with your own numbers.

---

### 3. The Bean Sprout Project

**The Challenge:** Predict the exact height of a bean sprout based on how many milliliters of water it gets.

**The Data:**
- **The Green Thumb:** Just the right amount of water leading to steady growth.
- **The Flood:** Overwatered plants that actually stopped growing or died.
- **The Cactus:** Data from a totally different plant that barely needs water.

**The Takeaway :** Mathematical lines go on forever, but nature doesn't. Students learn that more water doesn't infinitely equal a taller plant.

**Try It Out:** Track your own gardening attempts and input the watering amounts to see the AI's growth predictions.

---

### 4. The Study Score Predictor

**The Challenge:** Guess a student's math test score based on how many hours they spent studying.

**The Data:**
- **The Honest Class:** A clear trend where studying more leads to higher scores.
- **The Guesser:** Data that includes a student who studied zero hours but guessed everything right and got a 100.
- **The All-Nighter:** Data showing that studying past 14 hours actually causes scores to drop from exhaustion.

**The Takeaway:** Diminishing returns. Just a few extreme outliers (like the lucky guesser) can drag the AI's prediction line away from reality.

**Try It Out:** Anonymously log your class's study hours and quiz scores to build a custom AI model just for your classroom.

---

### 5. The Lemonade Stand

**The Challenge:** Predict how many cups of lemonade you will sell based on the outdoor temperature.

**The Data:**
- **Summer Vacation:** Hotter days consistently equal more sales.
- **The Blizzard:** Freezing days where sales drop to exactly zero.
- **Free Lemonade Day:** The price was changed to $0, causing a massive spike in sales that the temperature can't explain.

**The Takeaway:** Correlation isn't causation. The AI can't predict reality perfectly if a major hidden variable (like changing the price) is ignored.

**Try It Out:** Check your local weather forecast and feed the temperatures into the model to predict your weekend sales.

---

### 6. The Speedrun Timer

**The Challenge:** Estimate how many minutes it will take to beat a video game level based on the number of enemies in it.

**The Data:**
- **The Casual Gamer:** A steady pace where more enemies take more time to defeat.
- **The Glitcher:** Players who use game glitches to skip 100 enemies in just 5 seconds.
- **Level 1 Only:** The AI is only taught using tiny levels with 1 to 5 enemies.

**The Takeaway:** Asking an AI trained only on tiny levels to predict a 500-enemy boss battle will give you a mathematically correct, but practically impossible answer.

**Try It Out:** Time yourself playing a level, count the enemies, and see if you can beat the AI's time prediction.

---

### 7. The Bike Brake Test

**The Challenge:** Predict how many meters it will take a bicycle to stop based on how fast it was going.

**The Data:**
- **Dry Pavement:** A clean, safe, and predictable stopping curve.
- **The Icy Road:** Slippery conditions that make the stopping distances wildly longer.
- **The Snail Pace:** Data only collected from bikes moving at a slow walking speed.

**The Takeaway:** Context matters. An AI model trained in a safe environment (dry pavement) is dangerous to rely on in a different environment (ice).

**Try It Out:** Ride your bike, drop a marker when you hit the brakes, measure the distance, and test the AI's accuracy.

---

## Part 2: Classification (Sorting and Labeling)

### 8. The Chat Moderator

**The Challenge:** Build a bot for a school gaming forum that reads chat messages and flags them as either "Safe" or "Toxic."

**The Data:**
- **Balanced Data:** An equal mix of friendly messages and toxic ones.
- **Imbalanced Data:** 9,900 safe messages and only 100 toxic ones.

**The Takeaway:** The accuracy trap! An AI trained on imbalanced data can score 99% accuracy by just blindly guessing "Safe" every single time, making it useless in the real world.

**Try It Out:** Type your own gaming slang into the chat to see if the AI accurately flags it or misunderstands you.

---

### 9. The Spam Catcher

**The Challenge:** Teach an AI to read video titles and text messages and label them as "Safe" or "Clickbait/Spam."

**The Data:**
- **Balanced Data:** A good mix of boring messages and obvious clickbait.
- **The ALL CAPS Trick:** The only clue the AI was given for spam is capitalized letters.
- **The Sarcastic Set:** Normal news uses exclamation points, but the scams use polite, formal language.

**The Takeaway:** AI only knows what you show it. If it learns that "ALL CAPS = SCAM," it will unfairly block harmless, excited text messages from your friends.

**Try It Out:** Paste real YouTube video titles into the app to test how easily the model gets fooled.

---

### 10. The Smart Trash Can

**The Challenge:** Use a camera to look at cafeteria waste and sort it into "Recycle," "Compost," or "Trash."

**The Data:**
- **Pristine Trash:** Perfect, studio-quality photos of clean cans and whole apples.
- **The Real World:** Crushed cans, crumpled paper, and half-eaten pizza boxes.
- **Mostly Plastic:** 990 photos of plastic bottles and almost no organic food waste.

**The Takeaway:** Real life is messy. A clean piece of paper goes in recycling, but that exact same paper covered in pizza grease belongs in the trash. AI struggles when rules overlap.

**Try It Out:** Hold your leftover lunch up to your webcam and see if the AI tells you the right bin to use.

---

### 11. The Gaming Bot Detector

**The Challenge:** Figure out if an online player is a "Human" or a "Cheating Bot" by looking at their clicks-per-second and reaction time.

**The Data:**
- **Clear Cut:** Bots clicking 50 times a second versus humans clicking 5 times a second.
- **The Pro Gamer:** Includes human esports players who have insanely fast, bot-like reaction times.
- **The AFK Bot:** Cheating bots programmed to stand perfectly still to avoid getting caught.

**The Takeaway:** If an AI is too strict, it will accidentally ban human players who are just really good at the game.

**Try It Out:** Take a 10-second "click speed test" in your browser and see if the AI thinks you are a bot.

---

### 12. The Forest Forager

**The Challenge:** Look at a mushroom's color, spots, and shape, and decide if it is "Safe to Eat" or "Poisonous."

**The Data:**
- **The Diverse Forest:** A healthy mix of red/safe, red/poisonous, brown/safe, and brown/poisonous mushrooms.
- **Red = Danger:** A biased dataset where every single poisonous mushroom happens to be red, and the safe ones are brown.

**The Takeaway:** Fatal bias. If you train an AI on bad data, it learns lazy rules like "Red is bad, Brown is good," and might tell you to eat a highly toxic brown mushroom.

**Try It Out:** Type in the traits of a mushroom you "found" in your backyard to see if you survive the AI's advice.

---

### 13. The Dog Translator

**The Challenge:** Listen to an audio clip of a dog's bark and classify it as "Playful," "Hungry," or "Stranger Alert."

**The Data:**
- **The Quiet Room:** Perfect, crystal-clear audio recordings.
- **The Dog Park:** Noisy recordings with wind, cars, and people shouting in the background.
- **Chihuahuas Only:** The AI was only trained on high-pitched small dogs.

**The Takeaway:** Demographic bias. An AI trained exclusively on small dogs will completely misunderstand the deep, booming bark of a Golden Retriever.

**Try It Out:** Record your own dog barking (or try barking into the microphone yourself!) to see what emotion the AI detects.

---

### 14. The Magic Potion Sorter

**The Challenge:** Play the role of a wizard's apprentice and sort glowing liquids into "Healing Potions" or "Dangerous Acids" based on their pH level and thickness.

**The Data:**
- **Distinct Potions:** Healing potions are always thick and basic; acids are watery and acidic.
- **Switched Labels:** A dataset where a clumsy wizard accidentally entered 20% of the labels backward.

**The Takeaway:** "Garbage In, Garbage Out." The AI completely relies on the humans who label the data. If the human makes typos, the AI learns the typos as facts.

**Try It Out:** Mix safe kitchen liquids like vinegar and baking soda, test their pH, and ask the AI what kind of potion you made.

---

## Part 3: Neural Networks (Computer Vision)

### 15. The Self-Driving Eye

**The Challenge:** Train the computer vision system for a self-driving car so it can recognize handwritten numbers on speed limit signs.

**The Data:**
- **High-Quality:** Thousands of perfectly centered, bright images.
- **Low-Resolution:** Highly pixelated, blurry, and compressed images.
- **Rotated Signs:** Images where the numbers are sideways, tilted, or upside down.

**The Takeaway:** Neural networks are very literal. Without a huge variety of data, an AI trained on perfectly upright numbers will fail to read a sign that is slightly tilted.

**Try It Out:** Draw your own speed limit sign on a piece of paper, hold it up to the webcam, and see if the car knows how fast to go.

---

### 16. The Emotion Reader

**The Challenge:** Train a neural network to look at a face and guess the emotion: Happy, Sad, or Surprised.

**The Data:**
- **Diverse Faces:** People photographed in different lighting, from different angles.
- **The Sunglasses Set:** Faces partially covered by glasses, hats, or masks.
- **The "Same Person" Set:** 1,000 pictures of the exact same person making different faces.

**The Takeaway:** Overfitting. If the network only ever sees one person, it learns to recognize that specific person, not the universal concept of human emotion. It will fail when looking at a stranger.

**Try It Out:** Snap 10 pictures of yourself smiling and frowning via your webcam, train the AI, and then challenge your friends to try and fool it.
