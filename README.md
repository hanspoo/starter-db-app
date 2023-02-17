# starter-db-app

Scaffold para app multi empresa con moderno registro de usuarios

# Stack

- nx
- react
- express
- postgresql - dev/prod
- sqlite - test
- typescript
- typeorm
- antd
- jest
- storybook

## Apps básicas

- Login
- Registro de empresas y usuarios
- Recuperación de contraseñas

Nota: Sin links en los correos

## Porque ?

Este proyecto nace en el desarrollo de un sistema de logística que evolucionó en multiempresas, multi usuarios, del tipo que se utiliza para desarrollar software como servicio.

Incorporamos un buen proceso de login, registro y recuperación de contraseñas con buenas prácticas como por ejemplo no mandar enlaces en los correos y usar tokens y no cookies. Por lo tanto nos parece un buen aporte a la comunidad el disponer de un proyecto prototipico con el cual comenzar un desarrollo.

Puede que queden algunas cosas vestigiales del sistema original de palets por ahí danto vueltas Les pedimos disculpas si es el caso nos avisan para irlas removiendo o nos mandan un MR.

Al app principal React, y la base de datos llevan el nombre flash, en el sentido de que les va ayudar hacer muy rápido sus proyectos.

Finalmente: disculpas por el spanglish, si efectivamente me ocurre que tiendo a mezclar el inglés y el español de manera casi involuntaria.

## Requisitos

node

```
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04
```

postgresql

```
sudo apt install postgresql
```

nx

```
sudo npm i -g nx
```

## Desarrollo

```
git clone https://github.com/hanspoo/starter-db-app
cd starter-db-app/
npm install
npm run test
```

Crear archivo .env.local en raiz del proyecto:

```
NX_SERVER_URL=http://localhost:3333
NX_PORT=3333
NX_UPLOAD_FOLDER=/home/username/uploads

NX_SMTP_USER=user@gmail.com
NX_SMTP_PASS=xxxxxxxxx
; NX_SMTP_SERVER=smtp.gmail.com
; NX_SMTP_PORT=587
```

Crear usuario y base de datos postgresql:

```
sudo -u postgres ./bin/init-db.sh
```

Se crea un usuario llamado flash, con contraseña flash y base de datos del mismo nombre.

Se sugiere modificar .env.local para cambiar esto, variables:

DB_HOST,DB_USER,DB_PASS y DB_NAME

Ejecutar backend

```
nx serve api
```

Ejecutar front en otro terminal

```
nx serve flash
```

Ir a al navegador:
http://localhost:4200

Ahora se puede logear con el:
usuario:
admin@b2pallet.com
password:
123456

## Producción

```
npm run build
cd dist/apps/api
node main.js
```
