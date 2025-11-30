const { useState, useEffect } = React;

function App() {
    const [cities, setCities] = useState([]);
    const [searchField, setSearchField] = useState('city_name');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadAllCities();
    }, []);

    const loadAllCities = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/cities');
            const data = await response.json();
            setCities(data || []);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
            setCities([]);
        }
        setLoading(false);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(
                `/api/search?field=${searchField}&value=${encodeURIComponent(searchValue)}`
            );
            const data = await response.json();
            setCities(data || []);
        } catch (error) {
            console.error('Ошибка поиска:', error);
            setCities([]);
        }
        setLoading(false);
    };

    const handleReset = () => {
        setSearchValue('');
        loadAllCities();
    };

    return (
        <div className="container">
            <h1>Города России</h1>

            <form onSubmit={handleSearch} className="search-form">
                <select 
                    value={searchField} 
                    onChange={(e) => setSearchField(e.target.value)}
                    className="search-select"
                >
                    <option value="city_name">Название города</option>
                    <option value="region_name">Регион</option>
                    <option value="distance_to_moscow">Расстояние до Москвы</option>
                    <option value="population_millions">Население</option>
                </select>

                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Введите значение для поиска..."
                    className="search-input"
                />

                <button type="submit" className="btn-primary">
                    Найти
                </button>
                <button type="button" onClick={handleReset} className="btn-secondary">
                    Сбросить
                </button>
            </form>

            <div className="results">
                {loading ? (
                    <p className="loading">Загрузка данных...</p>
                ) : cities.length > 0 ? (
                    <>
                        <div className="results-header">
                            <h2 className="results-count">
                                Найдено: {cities.length} {cities.length === 1 ? 'город' : 'городов'}
                            </h2>
                        </div>
                        <table className="cities-table">
                            <thead>
                                <tr>
                                    <th>Название города</th>
                                    <th>Регион</th>
                                    <th className="number-cell">Расстояние до Москвы, км</th>
                                    <th className="number-cell">Население, млн чел.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cities.map(city => (
                                    <tr key={city.id}>
                                        <td className="city-name" data-label="Город: ">
                                            {city.city_name}
                                        </td>
                                        <td className="region-name" data-label="Регион: ">
                                            {city.region_name}
                                        </td>
                                        <td className="number-cell" data-label="До Москвы: ">
                                            {city.distance_to_moscow.toLocaleString('ru-RU')}
                                        </td>
                                        <td className="number-cell" data-label="Население: ">
                                            {city.population_millions.toFixed(3)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <p className="no-results">По вашему запросу ничего не найдено</p>
                )}
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
