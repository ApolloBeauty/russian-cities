package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

type City struct {
	ID                 int     `json:"id"`
	CityName           string  `json:"city_name"`
	RegionName         string  `json:"region_name"`
	DistanceToMoscow   int     `json:"distance_to_moscow"`
	PopulationMillions float64 `json:"population_millions"`
}

var db *sql.DB

func initDB() {
	// Добавлен client_encoding=UTF8
	connStr := "host=localhost port=5432 user=cityuser password=citypass123 dbname=russian_cities_db sslmode=disable client_encoding=UTF8"
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Ошибка подключения к БД:", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("БД недоступна:", err)
	}

	// Принудительно установить UTF-8
	_, err = db.Exec("SET CLIENT_ENCODING TO 'UTF8'")
	if err != nil {
		log.Println("Предупреждение: не удалось установить кодировку")
	}

	log.Println("✓ Подключено к PostgreSQL")
}

// getAllCities и searchCities остаются без изменений
func getAllCities() ([]City, error) {
	query := `
		SELECT c.id, cn.name, r.name, c.distance_to_moscow, c.population_millions
		FROM cities c
		JOIN city_names cn ON c.city_id = cn.id
		JOIN regions r ON c.region_id = r.id
		ORDER BY c.population_millions DESC`

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cities := []City{}
	for rows.Next() {
		var city City
		err := rows.Scan(&city.ID, &city.CityName, &city.RegionName,
			&city.DistanceToMoscow, &city.PopulationMillions)
		if err != nil {
			continue
		}
		cities = append(cities, city)
	}
	return cities, nil
}

func searchCities(field, value string) ([]City, error) {
	query := `
		SELECT c.id, cn.name, r.name, c.distance_to_moscow, c.population_millions
		FROM cities c
		JOIN city_names cn ON c.city_id = cn.id
		JOIN regions r ON c.region_id = r.id
		WHERE `

	switch field {
	case "city_name":
		query += "LOWER(cn.name) LIKE LOWER($1)"
	case "region_name":
		query += "LOWER(r.name) LIKE LOWER($1)"
	case "distance_to_moscow":
		query += "CAST(c.distance_to_moscow AS TEXT) LIKE $1"
	case "population_millions":
		query += "CAST(c.population_millions AS TEXT) LIKE $1"
	default:
		query += "LOWER(cn.name) LIKE LOWER($1)"
	}

	searchValue := "%" + value + "%"
	rows, err := db.Query(query, searchValue)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cities := []City{}
	for rows.Next() {
		var city City
		err := rows.Scan(&city.ID, &city.CityName, &city.RegionName,
			&city.DistanceToMoscow, &city.PopulationMillions)
		if err != nil {
			continue
		}
		cities = append(cities, city)
	}
	return cities, nil
}
