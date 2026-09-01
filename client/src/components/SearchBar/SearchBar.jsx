import { useState } from "react";
import { useLanguage } from '../../context/LanguageContext'
import './SearchBar.scss'

function SearchBar({ onSearch, onUseMyLocation, disabled, locationLabel }) {
    const { t } = useLanguage()
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
            placeholder={t('searchPlaceholder')}
            disabled={disabled}
        />
            <button
                type="button"
                className="search-bar__location"
                onClick={onUseMyLocation}
                disabled={disabled}
                aria-label={locationLabel}
            >
                📍
            </button>
            <button type="submit" disabled={disabled}>{t('searchButton')}</button>
        </form>
    )
}

export default SearchBar
