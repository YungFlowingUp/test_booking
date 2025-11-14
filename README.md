# API для бронирования места на мероприятие. 
Один пользователь не может забронировать дважды на одно событие.
# Реализация на nest.js (typescript) + PostgreSQL
# Варианты установки:
## 1. Через docker:
### Требования: 
    1. Установленный docker
    2. Установленный docker-compose
### Действия:
    1. git clone https://github.com/YungFlowingUp/test_booking
    2. Перейти в каталог с проектом
    3. Исправить в docker-compose.yml переменные окружения, если нужно
    4. docker-compose up --build
## 2. В ручную:
### Требования: 
    1. Установленный node.js
    2. Установленная СУБД PostgreSQL
### Действия:
    1. git clone https://github.com/YungFlowingUp/test_booking
    2. Установить зависимости [npm install]
    3. Создать базу данных: скрипт в корне "db_creation.sql". Можно запустить в pgadmin или выполнив команду "psql -U postgres -f db_creation.sql", если у вас установлен psql глобально
    4. Настройить переменные окружения: ./.env: (.enc.example приложен)
        DB_HOST=
        DB_PORT=
        DB_USERNAME=
        DB_PASSWORD=
        DB_NAME=
    5. Запустить миграции [typeorm-ts-node-commonjs -d ./ormconfig.ts migration:run]. Создадутся таблицы, индексы и немного вводных событий.
    6. Запустить приложение [npm run start]

# API:
- /health - проверка подключения к бд
# API/bookings:
- POST /api/bookings/reserve - добавление брони
- GET /api/bookings/user/:userId - получение всех броней пользователя + пагинация
- GET /api/bookings/event/:eventId - получение всех броней у события + пагинация
- DELETE /api/bookings/delete - удаление брони
# API/events:
- GET /api/events - получение всех событий
- POST /api/events - доабвление нового события
- DELETE /api/events/:id - удаление события по его id
- PUT /api/events/:id - изменение данных о событии
