
TRUNCATE TABLE card_calculations, medical_cards, calculations, users RESTART IDENTITY;


INSERT INTO users (login, password, is_moderator) VALUES
('doctor1', 'pass123', false),
('admin', 'admin123', true);


INSERT INTO calculations (title, description, formula, image_url, category, gender, min_age, max_age, is_active) VALUES
('Мальчики 4-7 лет', 'Расчет ДЖЕЛ для мальчиков дошкольного возраста', 'ДЖЕЛ (л) = (0.043 × Рост) - (0.015 × Возраст) - 2.89', 'boys_4_7.png', 'дети', 'мужской', 4, 7, true),
('Девочки 4-7 лет', 'Расчет ДЖЕЛ для девочек дошкольного возраста', 'ДЖЕЛ (л) = (0.037 × Рост) - (0.012 × Возраст) - 2.54', 'girls_4_7.png', 'дети', 'женский', 4, 7, true),
('Мальчики 8-12 лет', 'Расчет ДЖЕЛ для мальчиков младшего школьного возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.60', 'boys_8_12.png', 'дети', 'мужской', 8, 12, true),
('Девочки 8-12 лет', 'Расчет ДЖЕЛ для девочек младшего школьного возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.70', 'girls_8_12.png', 'дети', 'женский', 8, 12, true),
('Юноши 13-17 лет', 'Расчет ДЖЕЛ для юношей подросткового возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.20', 'boys_13_17.png', 'подростки', 'мужской', 13, 17, true),
('Девушки 13-17 лет', 'Расчет ДЖЕЛ для девушек подросткового возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.20', 'girls_13_17.png', 'подростки', 'женский', 13, 17, true),
('Мужчины 18-60 лет', 'Расчет ДЖЕЛ для взрослых мужчин', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 3.60', 'men_18_60.png', 'взрослые', 'мужской', 18, 60, true),
('Женщины 18-60 лет', 'Расчет ДЖЕЛ для взрослых женщин', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 2.69', 'women_18_60.png', 'взрослые', 'женский', 18, 60, true),
('Пожилые 60+ лет', 'Расчет ДЖЕЛ для пожилых людей', 'ДЖЕЛ (л) = (0.044 × Рост) - (0.024 × Возраст) - 2.86', 'elderly_60plus.png', 'пожилые', 'унисекс', 60, 120, true);


SELECT 'Users:' as "";
SELECT * FROM users;

SELECT 'Calculations:' as "";
SELECT id, title, category, gender, min_age, max_age FROM calculations;

SELECT 'Medical Cards:' as "";
SELECT id, status, patient_name, created_at FROM medical_cards;

SELECT 'Card Calculations:' as "";
SELECT * FROM card_calculations;


-- Удаляем таблицы в правильном порядке (из-за foreign keys)
DROP TABLE IF EXISTS card_calculations CASCADE;
DROP TABLE IF EXISTS medical_cards CASCADE; 
DROP TABLE IF EXISTS calculations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

/* */
-- Очистка старых таблиц если существуют
DROP TABLE IF EXISTS med_mm_pvlc_calculations, pvlc_med_cards, pvlc_med_formulas, med_users;
TRUNCATE TABLE med_mm_pvlc_calculations, med_users, pvlc_med_cards, pvlc_med_formulas RESTART IDENTITY;

-- Вставка тестовых данных
INSERT INTO med_users (login, password, is_moderator) VALUES
('doctor1', 'pass123', false),
('admin', 'admin123', true);

INSERT INTO pvlc_med_formulas (title, description, formula, image_url, category, gender, min_age, max_age, is_active) VALUES
('Мальчики 4-7 лет', 'Расчет ДЖЕЛ для мальчиков дошкольного возраста', 'ДЖЕЛ (л) = (0.043 × Рост) - (0.015 × Возраст) - 2.89', 'boys_4_7.png', 'дети', 'мужской', 4, 7, true),
('Девочки 4-7 лет', 'Расчет ДЖЕЛ для девочек дошкольного возраста', 'ДЖЕЛ (л) = (0.037 × Рост) - (0.012 × Возраст) - 2.54', 'girls_4_7.png', 'дети', 'женский', 4, 7, true),
('Мальчики 8-12 лет', 'Расчет ДЖЕЛ для мальчиков младшего школьного возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.60', 'boys_8_12.png', 'дети', 'мужской', 8, 12, true),
('Девочки 8-12 лет', 'Расчет ДЖЕЛ для девочек младшего школьного возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.70', 'girls_8_12.png', 'дети', 'женский', 8, 12, true),
('Юноши 13-17 лет', 'Расчет ДЖЕЛ для юношей подросткового возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.20', 'boys_13_17.png', 'подростки', 'мужской', 13, 17, true),
('Девушки 13-17 лет', 'Расчет ДЖЕЛ для девушек подросткового возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.20', 'girls_13_17.png', 'подростки', 'женский', 13, 17, true),
('Мужчины 18-60 лет', 'Расчет ДЖЕЛ для взрослых мужчин', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 3.60', 'men_18_60.png', 'взрослые', 'мужской', 18, 60, true),
('Женщины 18-60 лет', 'Расчет ДЖЕЛ для взрослых женщин', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 2.69', 'women_18_60.png', 'взрослые', 'женский', 18, 60, true),
('Пожилые 60+ лет', 'Расчет ДЖЕЛ для пожилых людей', 'ДЖЕЛ (л) = (0.044 × Рост) - (0.024 × Возраст) - 2.86', 'elderly_60plus.png', 'пожилые', 'унисекс', 60, 120, true);

-- Проверка данных
SELECT 'Med Users:' as "";
SELECT * FROM med_users;

SELECT 'Pvlc Med Formulas:' as "";
SELECT id, title, category, gender, min_age, max_age FROM pvlc_med_formulas;

SELECT 'Pvlc Med Cards:' as "";
SELECT id, status, patient_name, created_at FROM pvlc_med_cards;

SELECT 'Med Mm Pvlc Calculations:' as "";
SELECT * FROM med_mm_pvlc_calculations;

-- init.sql
-- Вставка тестовых данных для лабораторной работы 4

-- Очищаем таблицы перед вставкой (для перезапуска)
TRUNCATE TABLE med_users CASCADE;
TRUNCATE TABLE pvlc_med_formulas CASCADE;






-- Вставка тестовых пользователей с разными ролями
-- ДОБАВЛЕНО ДЛЯ ЛАБОРАТОРНОЙ РАБОТЫ 4
INSERT INTO med_users (login, password, is_moderator) VALUES
('doctor1', 'pass123', false),           -- Обычный пользователь
('doctor2', 'pass123', false),           -- Обычный пользователь  
('admin', 'admin123', true),             -- Модератор
('moderator', 'mod123', true);           -- Модератор

-- Вставка формул ДЖЕЛ
INSERT INTO pvlc_med_formulas (title, description, formula, image_url, category, gender, min_age, max_age, is_active) VALUES
('Мальчики 4-7 лет', 'Расчет ДЖЕЛ для мальчиков дошкольного возраста', 'ДЖЕЛ (л) = (0.043 × Рост) - (0.015 × Возраст) - 2.89', 'boys_4_7.png', 'дети', 'мужской', 4, 7, true, NOW(), NOW()),
('Девочки 4-7 лет', 'Расчет ДЖЕЛ для девочек дошкольного возраста', 'ДЖЕЛ (л) = (0.037 × Рост) - (0.012 × Возраст) - 2.54', 'girls_4_7.png', 'дети', 'женский', 4, 7, true, NOW(), NOW()),
('Мальчики 8-12 лет', 'Расчет ДЖЕЛ для мальчиков младшего школьного возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.60', 'boys_8_12.png', 'дети', 'мужской', 8, 12, true, NOW(), NOW()),
('Девочки 8-12 лет', 'Расчет ДЖЕЛ для девочек младшего школьного возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.70', 'girls_8_12.png', 'дети', 'женский', 8, 12, true, NOW(), NOW()),
('Юноши 13-17 лет', 'Расчет ДЖЕЛ для юношей подросткового возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.20', 'boys_13_17.png', 'подростки', 'мужской', 13, 17, true, NOW(), NOW()),
('Девушки 13-17 лет', 'Расчет ДЖЕЛ для девушек подросткового возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.20', 'girls_13_17.png', 'подростки', 'женский', 13, 17, true, NOW(), NOW()),
('Мужчины 18-60 лет', 'Расчет ДЖЕЛ для взрослых мужчин', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 3.60', 'men_18_60.png', 'взрослые', 'мужской', 18, 60, true, NOW(), NOW()),
('Женщины 18-60 лет', 'Расчет ДЖЕЛ для взрослых женщин', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 2.69', 'women_18_60.png', 'взрослые', 'женский', 18, 60, true, NOW(), NOW()),
('Пожилые 60+ лет', 'Расчет ДЖЕЛ для пожилых людей', 'ДЖЕЛ (л) = (0.044 × Рост) - (0.024 × Возраст) - 2.86', 'elderly_60plus.png', 'пожилые', 'унисекс', 60, 120, true, NOW(), NOW());





---НОВАЯ АКТУАЛКА----
-- Очистка существующих данных (опционально)
DELETE FROM med_mm_pvlc_calculations;
DELETE FROM pvlc_med_cards;
DELETE FROM pvlc_med_formulas;
DELETE FROM med_users;

-- Сброс последовательностей (опционально)
ALTER SEQUENCE med_users_id_seq RESTART WITH 1;
ALTER SEQUENCE pvlc_med_formulas_id_seq RESTART WITH 1;
ALTER SEQUENCE pvlc_med_cards_id_seq RESTART WITH 1;
-- Инициализация базы данных для системы расчета ДЖЕЛ
TRUNCATE TABLE med_mm_pvlc_calculations, med_users, pvlc_med_cards, pvlc_med_formulas RESTART IDENTITY;
-- Лабораторная работа 4 - Аутентификация и авторизация

-- Вставка тестовых пользователей с разными ролями
INSERT INTO med_users (login, password, is_moderator, created_by) VALUES
('doctor1', 'pass123', false, 1),           -- Обычный пользователь
('doctor2', 'pass123', false, 1),           -- Обычный пользователь  
('admin', 'admin123', true, 1),             -- Модератор
('moderator', 'mod123', true, 1);           -- Модератор

-- Вставка формул ДЖЕЛ (9 категорий)
INSERT INTO pvlc_med_formulas (title, description, formula, image_url, category, gender, min_age, max_age, is_active) VALUES
('Мальчики 4-7 лет', 'Расчет ДЖЕЛ для мальчиков дошкольного возраста', 'ДЖЕЛ (л) = (0.043 × Рост) - (0.015 × Возраст) - 2.89', 'boys_4_7.png', 'дети', 'мужской', 4, 7, true),
('Девочки 4-7 лет', 'Расчет ДЖЕЛ для девочек дошкольного возраста', 'ДЖЕЛ (л) = (0.037 × Рост) - (0.012 × Возраст) - 2.54', 'girls_4_7.png', 'дети', 'женский', 4, 7, true),
('Мальчики 8-12 лет', 'Расчет ДЖЕЛ для мальчиков младшего школьного возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.60', 'boys_8_12.png', 'дети', 'мужской', 8, 12, true),
('Девочки 8-12 лет', 'Расчет ДЖЕЛ для девочек младшего школьного возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.70', 'girls_8_12.png', 'дети', 'женский', 8, 12, true),
('Юноши 13-17 лет', 'Расчет ДЖЕЛ для юношей подросткового возраста', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 4.20', 'boys_13_17.png', 'подростки', 'мужской', 13, 17, true),
('Девушки 13-17 лет', 'Расчет ДЖЕЛ для девушек подросткового возраста', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 3.20', 'girls_13_17.png', 'подростки', 'женский', 13, 17, true),
('Мужчины 18-60 лет', 'Расчет ДЖЕЛ для взрослых мужчин', 'ДЖЕЛ (л) = (0.052 × Рост) - (0.022 × Возраст) - 3.60', 'men_18_60.png', 'взрослые', 'мужской', 18, 60, true),
('Женщины 18-60 лет', 'Расчет ДЖЕЛ для взрослых женщин', 'ДЖЕЛ (л) = (0.041 × Рост) - (0.018 × Возраст) - 2.69', 'women_18_60.png', 'взрослые', 'женский', 18, 60, true),
('Пожилые 60+ лет', 'Расчет ДЖЕЛ для пожилых людей', 'ДЖЕЛ (л) = (0.044 × Рост) - (0.024 × Возраст) - 2.86', 'elderly_60plus.png', 'пожилые', 'унисекс', 60, 120, true);

-- Создание тестовой медицинской карты (черновик)
INSERT INTO pvlc_med_cards (status, patient_name, doctor_name, user_id) VALUES
('черновик', 'Тестовый Пациент', 'Иванов И.И.', 1);

-- Добавление тестовых расчетов в медицинскую карту
INSERT INTO med_mm_pvlc_calculations (pvlc_med_card_id, pvlc_med_formula_id, input_height, final_result) VALUES
(1, 1, 120.0, 2.15),
(1, 3, 140.0, 3.25);

-- Вывод информации о созданных данных
SELECT 'База данных успешно инициализирована!' as message;

-- Проверка созданных пользователей
SELECT 'Пользователи:' as info;
SELECT id, login, is_moderator FROM med_users;

-- Проверка созданных формул
SELECT 'Формулы ДЖЕЛ:' as info;
SELECT id, title, category, gender, min_age, max_age FROM pvlc_med_formulas;

-- Проверка медицинских карт
SELECT 'Медицинские карты:' as info;
SELECT id, status, patient_name, doctor_name FROM pvlc_med_cards;

-- Проверка расчетов
SELECT 'Расчеты ДЖЕЛ:' as info;
SELECT pvlc_med_card_id, pvlc_med_formula_id, input_height, final_result 
FROM med_mm_pvlc_calculations;