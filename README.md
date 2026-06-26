# <h1 align="center"> 📍 GPS Vivo - Geolocalización en Tiempo Real con Ionic / Codex 🛰️ </h1>

## Descripción

Aplicación móvil desarrollada con Ionic y Angular que utiliza las capacidades de geolocalización del dispositivo para obtener y mostrar la ubicación actual del usuario en tiempo real.

La aplicación permite:

- Solicitar permisos de ubicación
- Obtener coordenadas GPS precisas
- Mostrar latitud y longitud actuales
- Visualizar la precisión de la lectura GPS
- Mostrar la hora de la última actualización
- Abrir la ubicación en Google Maps
- Copiar coordenadas al portapapeles
- Iniciar y detener el seguimiento GPS en segundo plano
- Registrar un historial de ubicaciones obtenidas
- Mantener el seguimiento mediante un servicio en primer plano de Android

---

## Autora

- Nayely Ayol

---

## Tecnologías utilizadas

- Ionic
- Angular
- TypeScript
- Capacitor
- Capacitor Geolocation
- Capacitor Community Background Geolocation
- Android Studio

---

## Herramienta de IA utilizada

Este proyecto fue desarrollado utilizando **Codex** como herramienta de asistencia para la generación y optimización del código fuente.

---

## Funcionalidades

- Obtención de ubicación GPS en tiempo real
- Solicitud automática de permisos de ubicación
- Validación de coordenadas obtenidas
- Visualización de precisión GPS
- Visualización de estado de permisos
- Apertura de ubicación en Google Maps
- Copia de coordenadas al portapapeles
- Interfaz moderna y responsiva
- Splash Screen personalizado
- Ícono personalizado
- Seguimiento GPS en segundo plano
- Historial de ubicaciones registradas
- Inicio y detención del seguimiento en tiempo real
- Notificación persistente mientras el GPS permanece activo

---

## Proceso de desarrollo

### 1. Creación del proyecto con Codex

Para el desarrollo de la aplicación se utilizó **Codex** como asistente de programación.

#### Instalación de Codex

Primero se descargó e instaló Codex desde su página oficial.

<img width="557" height="517" alt="image" src="https://github.com/user-attachments/assets/057bc033-57aa-4eb6-bb42-c595a4c96943" />

---

#### Selección del proyecto

Una vez instalado, se seleccionó un proyecto Ionic existente para trabajar con la herramienta.

<img width="767" height="319" alt="image" src="https://github.com/user-attachments/assets/9a7b814b-9435-4bfd-a804-6990c9b68ede" />

---

#### Apertura del proyecto

Después de seleccionar el proyecto, este se visualizó en el panel lateral derecho de Codex para comenzar la generación automática del código.

<img width="467" height="609" alt="image" src="https://github.com/user-attachments/assets/e6af09ae-c175-4d25-9489-c69ae76aeddd" />

---

#### Prompt utilizado

Se ingresó el siguiente prompt para generar la aplicación:

```text
Crea una aplicación Ionic que obtenga la ubicación GPS actual usando Capacitor Geolocation,
con manejo de permisos y errores y validaciones, asegúrate que el diseño este acorde con el
tema y que sea actual y novedoso con colores corales no muy saturados como claritos, tonos
azules, celestes, verdes, crema o morados, los que mejor combinen.
```

<img width="886" height="315" alt="image" src="https://github.com/user-attachments/assets/96151fbc-0114-49c8-b61f-6b498bcfc210" />

---

#### Generación automática del código

Codex analizó el requerimiento y generó automáticamente la lógica necesaria para:

- Solicitar permisos de ubicación.
- Obtener coordenadas GPS.
- Validar los datos obtenidos.
- Manejar errores de geolocalización.
- Mostrar información detallada de la ubicación.
- Diseñar una interfaz moderna acorde al tema GPS.

<img width="886" height="600" alt="image" src="https://github.com/user-attachments/assets/b49ee1a7-d051-45ac-b388-42c9d0dcf8f8" />

---

#### Implementación del seguimiento en segundo plano

Posteriormente se solicitó a Codex ampliar la funcionalidad para incorporar el seguimiento continuo de la ubicación utilizando Background Geolocation, manteniendo el GPS activo incluso cuando la aplicación permanece minimizada.

<img width="886" height="445" alt="image" src="https://github.com/user-attachments/assets/f145da9d-21c4-42f6-8406-82278104944c" />

---

#### Ejecución del proyecto

Una vez finalizada la generación del código, se ejecutó la aplicación mediante:

```bash
ionic serve
```

Posteriormente se verificó el correcto funcionamiento de la interfaz y de la lectura GPS.

---

### 2. Instalación de dependencias

```bash
npm install
npm install @capacitor/geolocation
npm install @capacitor-community/background-geolocation

npx cap sync android
```

---

### 3. Configuración de permisos Android

Archivo:

```
android/app/src/main/AndroidManifest.xml
```

Permisos agregados:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
```

Servicio de segundo plano registrado dentro de `<application>`:

```xml
<service
    android:name="com.equimaps.capacitor_background_geolocation.BackgroundGeolocationService"
    android:enabled="true"
    android:exported="true"
    android:foregroundServiceType="location"
    android:stopWithTask="false" />
```

---

### 4. Implementación de geolocalización

Importaciones utilizadas:

```ts
import { Capacitor, PermissionState } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
```

Obtención de la ubicación:

```ts
const currentPosition = await Geolocation.getCurrentPosition({
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0,
});
```

Solicitud de permisos:

```ts
const requested = await Geolocation.requestPermissions({
  permissions: ['location'],
});
```

---

### 5. Implementación del seguimiento en segundo plano

Para mantener la actualización continua de la ubicación incluso cuando la aplicación permanece minimizada, se implementó el plugin Background Geolocation.

Registro del plugin:

```ts
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
);
```

Inicio del seguimiento:

```ts
await BackgroundGeolocation.addWatcher(
  {
    backgroundMessage: 'Registrando tu ubicación GPS en segundo plano',
    backgroundTitle: 'GPS Vivo Activo',
    requestPermissions: true,
    distanceFilter: 10,
  },
  (location, error) => {
    // Actualizar coordenadas, historial y estado
  }
);
```

Detención del seguimiento:

```ts
await BackgroundGeolocation.removeWatcher({
  id: this.bgWatcherId,
});
```

Durante el seguimiento se actualizan automáticamente:

- Coordenadas GPS
- Precisión
- Hora de actualización
- Historial de ubicaciones
- Estado del seguimiento

---

### 6. Manejo de errores

La aplicación incorpora validaciones y control de errores para distintos escenarios:

- GPS desactivado en el dispositivo
- Permisos denegados por el usuario
- Permisos denegados permanentemente
- Timeout al obtener la ubicación
- Fallo en el stream de segundo plano

---

### 7. Historial de ubicaciones

Cada lectura GPS obtenida se almacena temporalmente en memoria para permitir consultar los últimos recorridos realizados.

Cada registro almacena:

- Latitud
- Longitud
- Precisión
- Hora de captura
- Tipo de lectura (Primer plano o Segundo plano)

El historial puede visualizarse desde la interfaz y eliminarse mediante el botón **Limpiar**.

---

## Interfaz principal

La interfaz permite al usuario:

- Obtener su ubicación actual
- Iniciar el seguimiento GPS continuo
- Detener el seguimiento cuando lo desee
- Consultar el historial de ubicaciones
- Visualizar la precisión GPS
- Consultar el estado de permisos
- Abrir la ubicación en Google Maps
- Copiar coordenadas

Botón principal:

```html
<ion-button
  size="large"
  (click)="locateMe()"
  [disabled]="status === 'checking'">
  Obtener GPS
</ion-button>
```

Visualización de coordenadas:

```html
<strong>{{ coordinatesText }}</strong>
```

Visualización de precisión:

```html
<strong>
  {{ position ? (position.coords.accuracy | number:'1.0-0') + ' m' : '-- m' }}
</strong>
```

---

## Implementación de ícono y Splash Screen

### Ícono

1. Crear carpeta:

```
resources/
```

2. Agregar imagen `icon.png` con resolución recomendada de **1024 × 1024 px**.

3. Instalar herramienta:

```bash
npm install @capacitor/assets
```

4. Generar recursos:

```bash
ionic build
ionic cap add android
npx cap sync android
npx capacitor-assets generate
```

---

### Splash Screen

Editar:

```
android/app/src/main/res/values/styles.xml
```

Agregar:

```xml
<style name="AppTheme.NoActionBarLaunch" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">@color/splash_background</item>
    <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher</item>
    <item name="windowSplashScreenIconBackgroundColor">@color/splash_background</item>
    <item name="postSplashScreenTheme">@style/AppTheme.NoActionBar</item>
</style>
```

Crear archivo `colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">#FFFFFF</color>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
```

Sincronizar:

```bash
npx cap sync android
```

---

## Ejecución en dispositivo Android

Abrir proyecto Android:

```bash
npx cap open android
```

Generar APK:

```
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## Capturas de la funcionalidad

| Splash Screen | Ícono |
| :-----------: | :---: |
| <img width="600" height="900" alt="Splash Screen" src="https://github.com/user-attachments/assets/6f209aca-53de-4584-8315-4943d6dfb036" /> | <img width="600" height="900" alt="Ícono" src="https://github.com/user-attachments/assets/41697637-4739-4a7b-a3c3-6555d8542b6c" /> |

| Ubicación obtenida con éxito | Falla al obtener ubicación |
| :--------------------------: | :------------------------: |
| <img width="337" height="1600" alt="WhatsApp Image 2026-06-25 at 9 39 18 AM" src="https://github.com/user-attachments/assets/8e40ee7f-0a71-46d9-b1b0-fe6a5eef6f4a" />| <img width="368" height="1600" alt="WhatsApp Image 2026-06-25 at 9 39 18 AM (1)" src="https://github.com/user-attachments/assets/5b677126-ef9d-421b-a971-cdab823e5d81" />|

| Permisos GPS | Google Maps |
| :----------: | :---------: |
| <img width="600" height="900" alt="Permisos GPS" src="https://github.com/user-attachments/assets/163c1133-ee67-4665-ad6d-c53877fb93b9" /> | <img width="600" height="900" alt="Google Maps" src="https://github.com/user-attachments/assets/d1e8b5b1-3e27-4c41-b9dd-517f7436b145" /> |

| Seguimiento iniciado | Historial de ubicaciones |
| :------------------: | :----------------------: |
| <img width="720" height="1600" alt="WhatsApp Image 2026-06-25 at 5 02 05 PM" src="https://github.com/user-attachments/assets/ee2db5ba-5139-4181-ad12-655d47a9a1a4" />| <img width="720" height="1600" alt="WhatsApp Image 2026-06-25 at 5 01 45 PM (2)" src="https://github.com/user-attachments/assets/77af2a53-4433-4fc6-ba2f-cc961dbed756" />|

| Notificación en segundo plano | Seguimiento detenido |
| :---------------------------: | :------------------: |
| <img width="720" height="1600" alt="WhatsApp Image 2026-06-25 at 5 01 45 PM" src="https://github.com/user-attachments/assets/015e84ba-b0a0-4b98-ab56-29c2e42e023c" />|<img width="720" height="1600" alt="WhatsApp Image 2026-06-25 at 5 02 05 PM (1)" src="https://github.com/user-attachments/assets/fc6fc252-1b77-4dc2-aad4-bfdef831e977" />|



---

## Video de funcionamiento

- https://vt.tiktok.com/ZSCjEoaEx/

---

## Descarga la APK

- https://drive.google.com/drive/folders/10nvnYFlkPQAATrU57Jp-fbqdu3DVn7B4?usp=sharing

---
## Resultados

- Se obtuvo correctamente la ubicación GPS del dispositivo.
- Se implementó la solicitud y validación de permisos de ubicación.
- Se visualizaron coordenadas geográficas precisas.
- Se integró la apertura directa en Google Maps.
- Se implementó la copia de coordenadas al portapapeles.
- Se desarrolló un sistema de seguimiento GPS continuo en segundo plano.
- Se registró un historial de ubicaciones obtenidas tanto en primer plano como en segundo plano.
- Se implementó una notificación persistente durante el seguimiento continuo.
- Se personalizaron el ícono y la Splash Screen de la aplicación.
- Se obtuvo un APK funcional para dispositivos Android.
- Proyecto desarrollado con apoyo de **Codex**.
