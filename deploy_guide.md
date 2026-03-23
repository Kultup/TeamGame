# Інструкція з розвертання проекту на сервері з нуля

Цей гайд допоможе вам налаштувати та запустити проект **TeamGame** на чистому сервері (Ubuntu/Linux).

## 1. Підготовка середовища (Environment Setup)

Оновіть пакети та встановіть необхідні інструменти:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential
```

### Встановлення Node.js (v20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```
> [!NOTE]
> Якщо ви бачите помилку про конфлікт з **libnode-dev**, виконайте:
> `sudo apt remove libnode-dev && sudo apt --fix-broken install`
> після чого знову `sudo apt install -y nodejs`.

### Встановлення MongoDB:
```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 2. Клонування та налаштування проекту

Зайдіть у директорію, де буде жити проект:
```bash
cd /home/kultup
git clone <URL_ВАШОГО_РЕПОЗИТОРІЮ> TeamGame
cd TeamGame
```

### Встановлення залежностей:
```bash
npm install
```

### Налаштування середовища (.env):
Створіть файл `.env` у корені проекту (`/home/kultup/TeamGame/`):
```bash
touch .env
```
Додайте в нього наступне:
```env
MONGODB_URI=mongodb://localhost:27017/teamgame
PORT=3000
```

## 3. Наповнення бази даних

Запустіть скрипт для завантаження категорій та запитань:
```bash
npm run seed
```

## 4. Збірка фронтенду (Vite)

Створіть оптимізовану версію клієнтської частини:
```bash
npm run build
```

## 5. Запуск через PM2 (Process Management)

Щоб сервер працював у фоні та автоматично перезапускався:
```bash
sudo npm install -g pm2
pm2 start server/index.js --name "team-game"
pm2 save
pm2 startup
```

## 6. Налаштування Nginx (Рекомендовано)

Щоб сайт був доступний за портом 80 (HTTP) або доменним ім'ям:
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/teamgame
```
Додайте конфігурацію:
```nginx
server {
    listen 80;
    server_name vash-domen.com; # замініть на ваш IP або домен

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Активуйте конфіг:
```bash
sudo ln -s /etc/nginx/sites-available/teamgame /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---
**Тепер проект доступний за адресою вашого сервера!**
