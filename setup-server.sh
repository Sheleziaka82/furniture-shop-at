#!/bin/bash

# Скрипт автоматической установки всех зависимостей для развертывания Möbelhaus AT
# Использование: sudo bash setup-server.sh

set -e

echo "========================================="
echo "Установка зависимостей для Möbelhaus AT"
echo "========================================="

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Функция для вывода сообщений
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка прав администратора
if [[ $EUID -ne 0 ]]; then
   log_error "Этот скрипт должен быть запущен с правами администратора (sudo)"
   exit 1
fi

# Определение ОС
if [[ ! -f /etc/os-release ]]; then
    log_error "Не удалось определить ОС"
    exit 1
fi

source /etc/os-release

if [[ "$ID" != "ubuntu" && "$ID" != "debian" ]]; then
    log_error "Этот скрипт поддерживает только Ubuntu и Debian"
    exit 1
fi

log_info "Обнаружена ОС: $ID $VERSION_ID"

# ============================================
# 1. Обновление системы
# ============================================
log_info "Обновление системы..."
apt update
apt upgrade -y

# ============================================
# 2. Установка основных пакетов
# ============================================
log_info "Установка основных пакетов..."
apt install -y \
    curl \
    wget \
    git \
    build-essential \
    python3 \
    python3-pip \
    vim \
    nano \
    htop \
    iotop \
    nethogs \
    unzip \
    zip \
    rsync \
    tar \
    gzip \
    logrotate

# ============================================
# 3. Установка Node.js 18+
# ============================================
log_info "Установка Node.js 18+..."

# Проверка если Node.js уже установлен
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    log_warn "Node.js уже установлен: $NODE_VERSION"
else
    # Установка NodeSource репозитория
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    log_info "Node.js установлен: $(node -v)"
fi

# ============================================
# 4. Установка pnpm
# ============================================
log_info "Установка pnpm..."

if command -v pnpm &> /dev/null; then
    log_warn "pnpm уже установлен: $(pnpm -v)"
else
    npm install -g pnpm
    log_info "pnpm установлен: $(pnpm -v)"
fi

# ============================================
# 5. Установка PM2
# ============================================
log_info "Установка PM2..."

if command -v pm2 &> /dev/null; then
    log_warn "PM2 уже установлен"
else
    npm install -g pm2
    pm2 startup
    log_info "PM2 установлен и настроен"
fi

# ============================================
# 6. Установка MySQL Server
# ============================================
log_info "Установка MySQL Server..."

if command -v mysql &> /dev/null; then
    log_warn "MySQL уже установлен"
else
    apt install -y mysql-server
    systemctl start mysql
    systemctl enable mysql
    log_info "MySQL установлен и запущен"
fi

# ============================================
# 7. Установка Nginx
# ============================================
log_info "Установка Nginx..."

if command -v nginx &> /dev/null; then
    log_warn "Nginx уже установлен"
else
    apt install -y nginx
    systemctl start nginx
    systemctl enable nginx
    log_info "Nginx установлен и запущен"
fi

# ============================================
# 8. Установка Certbot (Let's Encrypt)
# ============================================
log_info "Установка Certbot для SSL сертификатов..."

if command -v certbot &> /dev/null; then
    log_warn "Certbot уже установлен"
else
    apt install -y certbot python3-certbot-nginx
    log_info "Certbot установлен"
fi

# ============================================
# 9. Установка дополнительных инструментов
# ============================================
log_info "Установка дополнительных инструментов..."

# Supervisor для управления сервисами
apt install -y supervisor

# Git для управления версиями
if ! command -v git &> /dev/null; then
    apt install -y git
fi

# ============================================
# 10. Проверка установки
# ============================================
log_info "Проверка установленных пакетов..."

echo ""
echo "========================================="
echo "Версии установленных компонентов:"
echo "========================================="
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"
echo "pnpm: $(pnpm -v)"
echo "PM2: $(pm2 -v)"
echo "MySQL: $(mysql --version)"
echo "Nginx: $(nginx -v 2>&1)"
echo "Certbot: $(certbot --version)"
echo "Git: $(git --version)"
echo "========================================="

# ============================================
# 11. Создание пользователя для приложения
# ============================================
log_info "Создание пользователя для приложения..."

if id "furniture-app" &>/dev/null; then
    log_warn "Пользователь furniture-app уже существует"
else
    useradd -m -s /bin/bash furniture-app
    log_info "Пользователь furniture-app создан"
fi

# ============================================
# 12. Создание директории для приложения
# ============================================
log_info "Создание директории для приложения..."

mkdir -p /var/www/furniture-shop
chown -R furniture-app:furniture-app /var/www/furniture-shop
chmod -R 755 /var/www/furniture-shop

log_info "Директория создана: /var/www/furniture-shop"

# ============================================
# 13. Создание директории для логов
# ============================================
log_info "Создание директории для логов..."

mkdir -p /var/log/furniture-shop
chown -R furniture-app:furniture-app /var/log/furniture-shop
chmod -R 755 /var/log/furniture-shop

log_info "Директория логов создана: /var/log/furniture-shop"

# ============================================
# 14. Создание директории для резервных копий
# ============================================
log_info "Создание директории для резервных копий..."

mkdir -p /var/backups/furniture-shop
chmod -R 755 /var/backups/furniture-shop

log_info "Директория резервных копий создана: /var/backups/furniture-shop"

# ============================================
# Завершение
# ============================================
echo ""
echo "========================================="
echo -e "${GREEN}✓ Установка завершена успешно!${NC}"
echo "========================================="
echo ""
echo "Следующие шаги:"
echo "1. Загрузите проект в /var/www/furniture-shop"
echo "2. Установите зависимости: cd /var/www/furniture-shop && pnpm install"
echo "3. Создайте .env файл с конфигурацией"
echo "4. Запустите миграции БД: pnpm db:push"
echo "5. Соберите проект: pnpm build"
echo "6. Запустите с PM2: pm2 start dist/index.js --name 'furniture-shop'"
echo "7. Настройте Nginx как reverse proxy"
echo "8. Получите SSL сертификат: sudo certbot certonly --nginx -d your-domain.com"
echo ""
echo "Для получения дополнительной помощи см. VPS_DEPLOYMENT_GUIDE.md"
echo "========================================="
