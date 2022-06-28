import React, { useState, useEffect } from "react";
import { AiFillCopy } from "react-icons/ai";
import { FaExchangeAlt, FaArrowRight } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { CopyToClipboard } from "react-copy-to-clipboard";

import Api from "./api";

import "./App.css";

function App() {

  const [languageOption, setLanguageOption] = useState("Cape Verdian Creole");
  const [translation, setTranslation] = useState(null);
  const [sourceSentence, setSourceSentence] = useState();
  const [translatorModels, setTranslatorModels] = useState([]);
  const [modelTranslator, setModelTranslator] = useState("gru")

  /**
   * To get all the available models in order to perform
   * the translations.
   */
  useEffect(() => {
    try {
      Api.get(`/translate`).then((res) => {
        const models = res.data.data.translator_models;
        if (models) setTranslatorModels(models);
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  
  /**
   * To controll the switching on the source and target
   * languague.
   */
  const languageOptionHandler = () => {
    languageOption === "Cape Verdian Creole"
      ? setLanguageOption("English")
      : setLanguageOption("Cape Verdian Creole");
    removeSouceSentence()
  };

  /**
   * Handle the source sentences changes.
   * @param {*} string 
   */
  const sourceSentenceHandler = (string) => {
    setSourceSentence(string);
    if (sourceSentence === "") setTranslation(null);
  };

  /**
   * To remove both the source and target sentence 
   * from the boxes.
   */
  const removeSouceSentence = () => {
    setSourceSentence("");
    setTranslation(null);
  };
  
  /**
   * Method to handle the model selector event,
   * or more detailed the users choice.
   * @param {*} event 
   */
  const modelNameHandler = (event)  => {
    setModelTranslator(event.target.value)
  }

  /**
   * Method to translate a sentence according to the model
   * and the direction.
   */
  const getTranslation = async () => {

    let target_translation;
    const source = languageOption === "Cape Verdian Creole" ? "cv" : "en";
    const target = source === "en" ? "cv" : "en";

    try {
      Api.post(`/translate`, {
        sentence: sourceSentence,
        model: modelTranslator, 
        source: source, 
        target: target
      }).then((res) => {
        target_translation = res.data.data[0].translation;
        if (target_translation) setTranslation(target_translation);
      });
    } catch (error) {
      console.log(error.message);
    }

  };

  /**
   * Method auxiliar to valid the sentence before making it's 
   * translation.
   */
  const translateSentence = () => {
    if (sourceSentence !== "") getTranslation();
    else setTranslation(null);
  };

  return (
    <div className='App'>
      <h1 className='header-title'>Cape Verdean Creole Translator</h1>
      <div className='translation-conteiner'>
        <select className="model-selector" value={modelTranslator} onChange={modelNameHandler}>
          {translatorModels.map((model, index) =>
            <option key={index} value={model.name}>
                {model.name}: {model.parameters} params
            </option>
          )}
        </select>
        <br />
        <ul className='languagues-boxes'>
          <li className='language-display'>
            <div className='input-area'>
              <p className='language-selector'>{languageOption}</p>
              <p>
                <textarea
                  className='input-box'
                  spellCheck='false'
                  placeholder='Enter Text'
                  autoComplete='off'
                  value={sourceSentence}
                  onChange={(event) =>
                    sourceSentenceHandler(event.target.value)
                  }
                />
              </p>
              {sourceSentence && (
                <ImCross
                  onClick={removeSouceSentence}
                  className='remove-text-icon'
                />
              )}
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
                {translation && (
                  <CopyToClipboard text={translation}>
                    <AiFillCopy className='clipboard-copy' />
                  </CopyToClipboard>
                )}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
