#!/bin/bash

sed "s/users/productos/g; s/usuario/producto/g; s/Usuario/Producto/g; "  usuarios/usuarios.tsx  > /home/hans/embarcadero/flash-ws/libs/components/src/lib/productos/productos.tsx
sed "s/User/Producto/g; s/users/productos/g; s/usuario/producto/g; s/Usuario/Producto/g; "  /home/hans/embarcadero/flash-ws/apps/api/src/app/routers/users.ts >  /home/hans/embarcadero/flash-ws/apps/api/src/app/routers/productos.ts

