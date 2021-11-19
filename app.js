const wordResponse = async(word) => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();
    return data;
}

const submitEvent = (e) => {
    e.preventDefault();
    const word = wordElement.value;
    fetchData(word);
}
const fetchData = (word) => {
    searching.classList.remove('complete');
    wordResponse(word)
        .then(data => {
            const phonetic = data[0].phonetics[0].text;
            const audiosrc = data[0].phonetics[0].audio;
            if (phonetic) renderphoneticAndAudio(phonetic, audiosrc);
            return data;
        })
        .then(data => {
            ol.innerHTML = '';
            data[0].meanings.forEach(meaning => {
                meaning.definitions.forEach(def => {
                    let synonyms = 'Synonyms:';
                    let example;
                    if (def.synonyms.length > 0) {
                        def.synonyms.forEach(syn => synonyms += `<span class="synonym">${syn}</span>`);
                    } else {
                        synonyms = '';
                    }
                    if (def.example) {
                        example = `<strong>Example:</strong> ${def.example}`
                    } else {
                        example = '';
                    }
                    renderDefinationsToPage(meaning.partOfSpeech, def.definition, example, synonyms)
                })
            })
            searching.classList.add('complete');
            return data;
        })
        .catch(err => {
            searching.classList.add('complete');
            error.classList.remove('complete');
            setTimeout(() => error.classList.add('complete'), 5000);
        })
}
const renderDefinationsToPage = (partOfSpeech, definition, example, synonyms) => {
    ol.innerHTML += `<li>
    <h2>${partOfSpeech}</h2>
        <p id="meaning">Meaning: ${definition}</p>
        <p id="example">${example}</p>
        <div id="synonyms">${synonyms}</div>
</li>`
}
const renderphoneticAndAudio = (text, source) => {
    phonetic.innerHTML = `
        <label for="audio">${text}</label>
            <i class="fas fa-volume-up" id="icon"></i>`;
    audio.src = source;

    document.querySelector('#icon').addEventListener('click', () => audio.play());
}

const audio = document.querySelector('audio');
const phonetic = document.querySelector('#phonetic');
const ol = document.querySelector('ol');
const form = document.querySelector('form');
const wordElement = document.querySelector('#word');

form.addEventListener('submit', submitEvent);

ol.addEventListener('click', (e) => {
        if (e.target.classList.contains('synonym')) {
            fetchData(e.target.textContent);
        }
    })
    // audio.play()

//Search Animation

const circles = document.querySelector('.circles');
const searching = document.querySelector('.searching');
const error = document.querySelector('.error');
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