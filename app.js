const wordResponse = async word => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data;
}

const fetchData = (word) => {
    searching.classList.remove('complete');
    searching.querySelector('p').textContent = `Searching meaning of ${word}`;
    ol.innerHTML = '';
    phonetic.innerHTML = '';

    wordResponse(word)
        .then(data => {
            const phonetic = data[0].phonetics[0].text;
            const audiosrc = data[0].phonetics[0].audio;
            if (phonetic) renderphoneticAndAudio(word, phonetic, audiosrc);
            return data;
        })
        .then(data => {
            data[0].meanings.forEach(meaning => {
                meaning.definitions.forEach(def => {
                    let synonyms = 'Synonyms:';
                    let antonyms = 'Antonyms:';
                    let example;
                    if (def.synonyms.length) {
                        def.synonyms.forEach(syn => synonyms += `<span class="related-word">${syn}</span>`);
                    } else {
                        synonyms = '';
                    }
                    if (def.antonyms.length) {
                        def.antonyms.forEach(ant => antonyms += `<span class="related-word">${ant}</span>`);
                    } else {
                        antonyms = '';
                    }
                    if (def.example) {
                        example = `<strong>Example:</strong> ${def.example}`
                    } else {
                        example = '';
                    }
                    renderDefinationsToPage(meaning.partOfSpeech, def.definition, example, antonyms, synonyms);
                })
            });
            searching.classList.add('complete');
            wordElement.value = '';
        })
        .catch(err => {
            searching.classList.add('complete');
            error.classList.remove('complete');
            setTimeout(() => error.classList.add('complete'), 5000);
        });
}
const renderDefinationsToPage = (partOfSpeech, definition, example, antonyms, synonyms) => {
    ol.innerHTML +=
        `<li>
        <h2>${partOfSpeech}</h2>
        <p id="meaning">Meaning: ${definition}</p>
        <p id="example">${example}</p>
        <div class="related-words">${antonyms}</div>
        <div class="related-words">${synonyms}</div>
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

const audio = document.querySelector('audio');
const phonetic = document.querySelector('#phonetic');
const ol = document.querySelector('ol');
const form = document.querySelector('form');
const wordElement = document.querySelector('#word');
const error = document.querySelector('.error');

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

setInterval(animateCircles, 100);