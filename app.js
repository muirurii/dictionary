const audio = document.querySelector('audio');
const phonetic = document.querySelector('#phonetic');
const ol = document.querySelector('ol');
const form = document.querySelector('form');
const wordElement = document.querySelector('#word');
const clearButton = document.querySelector('.clear');
const error = document.querySelector('.error');


const wordResponse = async word => {
    setSearching(word);
    const circleInterval = setInterval(animateCircles, 100);

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        searching.classList.add('complete');
        clearInterval(circleInterval);

        if (response.status === 404) {
            setError('Word not found try searching another word');
            return;
        }

        const data = await response.json();
        return data;
    } catch (err) {
        searching.classList.add('complete');
        setError('Please check your internet connection and try again');
    }
}

const setError = (message) => {
    error.textContent = message;
    error.classList.remove('complete');
    setTimeout(() => error.classList.add('complete'), 5000);
}

const setSearching = word => {
    error.classList.add('complete');
    searching.classList.remove('complete');
    searching.querySelector('p').textContent = `Searching  ${word}`;
    wordElement.value = '';
    ol.innerHTML = '';
    phonetic.innerHTML = '';
    clearButton.className = 'clear';
}

const fetchData = async word => {

    const wordObj = await wordResponse(word);
    console.log(wordObj[0])
    const phoneticText = wordObj[0].phonetics[0].text;
    const audiosrc = wordObj[0].phonetics[0].audio;
    if (phoneticText) renderphoneticAndAudio(word, phoneticText, audiosrc);

    wordObj[0].meanings.forEach(meaning => {
        meaning.definitions.forEach(def => {

            // const synonyms = def.synonyms.length ? (
            //     def.synonyms.reduce((a, b) => a + `<span class="related-word">${b}</span>`, 'Synonyms:')
            // ) : '';
            // const antonyms = def.synonyms.length ? (
            //     def.antonyms.reduce((a, b) => a + `<span class="related-word">${b}</span>`, 'Atonyms:')
            // ) : '';
            const example = def.example ? `<strong>Example:</strong> ${def.example}` : '';
            renderDefinationsToPage(meaning.partOfSpeech, def.definition, example);

        });
    });
}

const renderDefinationsToPage = (partOfSpeech, definition, example, antonyms, synonyms) => {
    ol.innerHTML +=
        `<li>
            <h2>${partOfSpeech}</h2>
            <p id="meaning">Meaning: ${definition}</p>
            <p id="example">${example}</p>
         </li>`
}
const renderphoneticAndAudio = (word, text, source) => {
    phonetic.innerHTML = `
        <label><strong>${word}</strong> [<em>${text}</em>]</label>
        <i class="fas fa-volume-up" id="icon"></i>`;
    audio.src = source;

    const audioIcon = document.querySelector('#icon');
    audioIcon.addEventListener('click', () => {
        audio.play();
        audioIcon.setAttribute('style', 'color:#038');
    });
    audio.addEventListener('ended', () => {
        audioIcon.setAttribute('style', 'color:#000');
    })
}


//Events

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!wordElement.value) return;
    const word = wordElement.value;
    fetchData(word);
});

ol.addEventListener('click', (e) => {
    if (e.target.classList.contains('related-word')) {
        fetchData(e.target.textContent);
    }
});

wordElement.addEventListener('keyup', (e) => {
    clearButton.className = e.target.value.trim().length === 0 ? 'clear' : 'clear show';
});

clearButton.addEventListener('click', (e) => {
    e.target.classList.remove('show');
});

//Search Animation

const circles = document.querySelector('.circles');
const searching = document.querySelector('.searching');
let forwardDirection = true;


const animateCircles = () => {
    const activeCircle = circles.querySelector('.active');
    if (forwardDirection) {
        if (!activeCircle.nextElementSibling) {
            return forwardDirection = false;
        } else {
            activeCircle.classList.remove('active');
            activeCircle.nextElementSibling.classList.add('active');
        }

    } else {
        if (!activeCircle.previousElementSibling) {
            return forwardDirection = true;
        } else {
            activeCircle.classList.remove('active');
            activeCircle.previousElementSibling.classList.add('active');
        }
    }
}