import './CityChips.scss'

function CityChips({ icon, title, cities, onSelect }) {
  if (cities.length === 0) return null

  return (
    <div className="city-chips">
      <div className="city-chips__header">
        <span className="city-chips__icon">{icon}</span>
        <span className="city-chips__title">{title}</span>
      </div>
      <div className="city-chips__list">
        {cities.map((item) => (
          <button
            key={item.city}
            type="button"
            className="city-chips__chip"
            onClick={() => onSelect(item.city)}
          >
            {item.city}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CityChips
