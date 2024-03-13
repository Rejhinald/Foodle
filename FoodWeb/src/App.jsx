import { useState, useEffect } from 'react';
import './App.css';
import axios from "axios";

function App() {
  const [answer, setAnswer] = useState("");
  const [mealTime, setMealTime] = useState("Any");
  const [occasion, setOccasion] = useState("");
  const [nationality, setNationality] = useState("");
  const [otherRequests, setOtherRequests] = useState("");
  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    async function fetchNationalities() {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map(country => country.name.common);
        const sortedCountries = countries.sort((a, b) => a.localeCompare(b));
        setNationalities(sortedCountries);
      } catch (error) {
        console.error('Error fetching nationalities:', error);
      }
    }
    fetchNationalities();
  }, []);

 async function generateAnswer(){
  setAnswer("loading...")
    const response = await axios({
      url:"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD0reMPyIP7bh6W6gY2OBCWiUUQbXz2YJs",
      method: "post",
      data: {
        contents: [
          { parts: [{ text: `Hey! So I'm going to cook today, I want you to search for recipes and instructions based on these parameters:\nTime of the Meal: ${mealTime}\nOccasion: ${occasion}\nNationality: ${nationality}\nOther Requests: ${otherRequests}`}]}
        ]
      }
    });
    setAnswer(response.data.candidates[0].content.parts[0].text);
  }

  return (
    <>
      <h1>FoodWeb</h1>
      <label>Time of the Meal:</label>
      <select value={mealTime} onChange={(e) => setMealTime(e.target.value)}>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snacks">Snacks</option>
        <option value="Any">Any</option>
      </select>
      <br />
      <label>Occasion:</label>
      <textarea value={occasion} onChange={(e) => setOccasion(e.target.value)} cols="30" rows="2"></textarea>
      <br />
      <label>Nationality:</label>
      <select value={nationality} onChange={(e) => setNationality(e.target.value)}>
        {nationalities.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>
      <br />
      <label>Other Requests:</label>
      <textarea value={otherRequests} onChange={(e) => setOtherRequests(e.target.value)} cols="30" rows="2"></textarea>
      <br />
      <button onClick={generateAnswer}>Generate Answer</button>
      <pre>{answer}</pre>
    </>
  )
}

export default App;
