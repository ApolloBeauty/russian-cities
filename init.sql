SET CLIENT_ENCODING TO 'UTF8';

DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS city_names CASCADE;
DROP TABLE IF EXISTS regions CASCADE;

CREATE TABLE regions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE city_names (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES city_names(id) ON DELETE CASCADE,
    region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE,
    distance_to_moscow INTEGER NOT NULL,
    population_millions DECIMAL(5,3) NOT NULL
);

INSERT INTO regions (name) VALUES 
('Московская область'),
('Санкт-Петербург'),
('Свердловская область'),
('Новосибирская область'),
('Краснодарский край'),
('Татарстан'),
('Челябинская область'),
('Нижегородская область'),
('Самарская область'),
('Ростовская область'),
('Красноярский край'),
('Приморский край'),
('Республика Башкортостан'),
('Пермский край'),
('Воронежская область');

INSERT INTO city_names (name) VALUES 
('Москва'),
('Санкт-Петербург'),
('Екатеринбург'),
('Новосибирск'),
('Краснодар'),
('Казань'),
('Челябинск'),
('Нижний Новгород'),
('Самара'),
('Ростов-на-Дону'),
('Красноярск'),
('Владивосток'),
('Уфа'),
('Пермь'),
('Воронеж');

INSERT INTO cities (city_id, region_id, distance_to_moscow, population_millions) VALUES 
(1, 1, 0, 12.640),
(2, 2, 714, 5.384),
(3, 3, 1781, 1.493),
(4, 4, 3303, 1.625),
(5, 5, 1386, 0.948),
(6, 6, 797, 1.257),
(7, 7, 1919, 1.196),
(8, 8, 439, 1.244),
(9, 9, 1065, 1.156),
(10, 10, 1092, 1.137),
(11, 11, 4173, 1.093),
(12, 12, 9288, 0.604),
(13, 13, 1357, 1.128),
(14, 14, 1397, 1.055),
(15, 15, 515, 1.057);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cityuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cityuser;
