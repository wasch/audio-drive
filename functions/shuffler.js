/**
 * Shuffles the input array using the fisher-yates algorithm
 */
export default function shuffler(shuffledArray) {
    if (shuffledArray.length === 1) return shuffledArray;
    let tempShuffledArray = shuffledArray.slice();
    let hasChanged = false;
    while (!hasChanged) {
        for (let i = shuffledArray.length - 1; i > 0; i--) {    // Shuffle
            const j = Math.floor(Math.random() * (i + 1));
            const temp = shuffledArray[i];
            shuffledArray[i] = shuffledArray[j];
            shuffledArray[j] = temp;
        }
        for (let i = 0; i < shuffledArray.length; i++) {    // Make sure shuffle didn't give the same array
            if (shuffledArray[i] !== tempShuffledArray[i]) hasChanged = true;
        }
    }
    return shuffledArray;
}