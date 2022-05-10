import React, { useState } from "react";
import { FaExchangeAlt, FaArrowRight } from "react-icons/fa";

import Api from "./api";

import "./App.css";

function App() {
  const [languageOption, setLanguageOption] = useState("Cape Verdian Creole");
  const [translation, setTranslation] = useState(null);
  const [sourceSentence, setSourceSentence] = useState();

  const languageOptionHandler = () => {
    languageOption === "Cape Verdian Creole"
      ? setLanguageOption("English")
      : setLanguageOption("Cape Verdian Creole");
  };

  const getTranslation = async () => {
    let target_translation;
    try {
      Api.post("/translate/cv/en", {
        sentence: sourceSentence,
      }).then((res) => {
        target_translation = res.data.data[0].translation;
        if (target_translation) setTranslation(target_translation);
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const translateSentence = () => {
    console.log(sourceSentence);
    if (sourceSentence !== "") getTranslation();
  };

  return (
    <div className='App'>
      <h1 className='header-title'>Cape Verdean Creole Translator</h1>
      <div className='translation-conteiner'>
        <ul className='languagues-boxes'>
          <li className='language-display'>
            <div>
              <p className='language-selector'>{languageOption}</p>
              <p>
                <textarea
                  className='input-box'
                  spellCheck='false'
                  placeholder='Enter Text'
                  autoComplete='off'
                  value={sourceSentence}
                  onChange={(event) => setSourceSentence(event.target.value)}
                />
              </p>
            </div>
          </li>
          <li className='language-display controller-display'>
            <div>
              <FaExchangeAlt
                className='arrows-ajust'
                onClick={languageOptionHandler}
              />
              <FaArrowRight
                onClick={translateSentence}
                className='translation-icon'
              />
            </div>
          </li>
          <li className='language-display'>
            <div>
              <p className='language-selector'>
                {languageOption === "Cape Verdian Creole"
                  ? "English"
                  : "Cape Verdian Creole"}
              </p>
              <p
                className={`output-box ${
                  translation ? "with-translation" : "no-translation"
                }`}>
                {translation ? translation : "Translation"}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
