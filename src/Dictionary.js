import React, {useState} from 'react';

const Dictionary = () => {

    const[word, setWord] = useState("");
    const[result, setResult] = useState(null);
    const[error, setError] = useState("");
    const[favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);

    const suggestedWords = ["hello", "excursion", "substantive", "lesson", "slipped"];

    const searchWord = async (searchTerm)  => {
        const query = (searchTerm || word || "").toString().toLowerCase();

          
        if(!query) {
            setError("Please enter a word")
            return;
        }
        setError("");
        setResult(null);

        try{
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
            if(!res.ok) throw new Error("Word not found");
            const data = await res.json();

            if (typeof data[0] === "string") {
            throw new Error(`Word not found. Did you mean: ${data.slice(0,3).join(", ")}?`);
          }

            const meaning = data[0].meanings[0].definitions[0].definition;
            const audioUrl = data[0].phonetics.find(p => p.audio)?.audio || "";

            setResult({word: query, meaning, audioUrl});
            setWord(query);
        }
        catch (err) {
            setError(err.message);
        }
    };
    const playAudio = (url) => {
        if (url) {
            const audio = new Audio(url);
            audio.play();
        }
    };
    const addFavorite = () => {
    if (!result) return;
    if (!favorites.includes(result.word)) {
      const newFavs = [...favorites, result.word];
      setFavorites(newFavs);
      localStorage.setItem("favorites", JSON.stringify(newFavs));
    }
   };
  
    const removeFavorite = (favWord) => {
    const newFavs = favorites.filter(w => w !== favWord);
    setFavorites(newFavs);
    localStorage.setItem("favorites", JSON.stringify(newFavs));
  };

  return (
  
    
    <div className='home_con'>
        <h1 className='heading'> English Dictionary</h1>
        <div className='input_con '>
            <input className='input_p'  type='text' value={word} onChange={(e) =>{ setWord(e.target.value); setError("");}} placeholder='Enter the word' />
            <button className='butto' onClick={() => searchWord()}> Search</button>
            
        </div>
         {error && <p className='error'>{error}</p>}
        <div className='container'>
           
           {!result && (
               <div >
                   <h3 className='heading'> Suggested Words</h3>
                   <div >
                      {suggestedWords.map((w) =>(
                        <button className='block_word' key={w} onClick={()=> searchWord(w)}> {w}</button>
                      ))}
                   </div>
               </div>
            )}

       
           {result && (
            <div >
               <h2 > <strong>Word: </strong> { result.word}</h2>
               <p className='definition'><strong>Definition:</strong> {result.meaning}</p>

               {result.audioUrl && ( <button className='aud_butn' onClick={() => playAudio(result.audioUrl)} > ▶ Play Audio </button>
                )}

               <div>
                  {!favorites.includes(result.word) ? (< button className="fav_btn add" onClick={addFavorite} aria-label={`Add ${result.word} to favorites`}> Add to Favorites </button> ) : (
                   <button className="fav_btn remove" onClick={() => removeFavorite(result.word)} aria-label={`Remove ${result.word} from favorites`} > Remove from Favorites </button> )}
               </div>
           </div>
            )}

            {favorites.length > 0 && (
            <div>
              <h2 className='heading'> Your Favorites</h2>
              <div>
                  {favorites.map((w) => (
                  <button className='block_word'
                  key={w}
                  onClick={() => searchWord(w)} >
                  {w}
                  </button>
                  ))}
               </div>
           </div>
           )}
       </div>
    </div>
  )
}

export default Dictionary
