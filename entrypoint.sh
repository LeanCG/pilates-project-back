#!/bin/sh

# Carga las variables del archivo .env
# if [ -f .env ]; then
#   echo "Loading environment variables from .env"
#   export $(grep -v '^#' .env | xargs)
# fi

# Verifica si se pasa un entorno, por defecto es "production"
NODE_ENV=${NODE_ENV:-production}
export NODE_ENV=$NODE_ENV

echo "Starting application in $NODE_ENV mode..."

# Ejecuta la aplicación
exec npm start
