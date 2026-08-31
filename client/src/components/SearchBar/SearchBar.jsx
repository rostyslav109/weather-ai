import { useState } from "react";
import './SearchBar.scss'

function SearchBar({onSearch, disabled}) {
    const [city, setCity] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        if(!city.trim()) return
        onSearch(city.trim())
    }

    return(
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Введи назву міста"
            disabled={disabled}
        />
            <button type="submit" disabled={disabled}>Пошук</button>
        </form>
    )
}

export default SearchBar