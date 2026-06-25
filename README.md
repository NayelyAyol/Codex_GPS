# <h1 align="center"> 📍 GPS Vivo - Geolocalización en Tiempo Real con Ionic 🛰️ </h1>

## Descripción

Aplicación móvil desarrollada con Ionic y Angular que utiliza las capacidades de geolocalización del dispositivo para obtener y mostrar la ubicación actual del usuario en tiempo real.

La aplicación permite:

* Solicitar permisos de ubicación
* Obtener coordenadas GPS precisas
* Mostrar latitud y longitud actuales
* Visualizar la precisión de la lectura GPS
* Mostrar la hora de la última actualización
* Abrir la ubicación en Google Maps
* Copiar coordenadas al portapapeles

---

## Autora

* Nayely Ayol

---

## Tecnologías utilizadas

* Ionic
* Angular
* TypeScript
* Capacitor
* Capacitor Geolocation
* Android Studio

---

## Herramienta de IA utilizada

Este proyecto fue desarrollado utilizando **Codex** como herramienta de asistencia para la generación y optimización del código fuente.

---

## Funcionalidades

* Obtención de ubicación GPS en tiempo real
* Solicitud automática de permisos de ubicación
* Validación de coordenadas obtenidas
* Visualización de precisión GPS
* Visualización de estado de permisos
* Apertura de ubicación en Google Maps
* Copia de coordenadas al portapapeles
* Interfaz moderna y responsiva
* Splash Screen personalizado
* Ícono personalizado

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
Crea una aplicación Ionic que obtenga la ubicación GPS actual usando Capacitor Geolocation, con manejo de permisos y errores y validaciones, asegúrate que el diseño este acorde con el tema y que sea actual y novedoso con colores corales no muy saturados como claritos, tonos azules, celestes, verdes, crema o morados, los que mejor combinen.
```

<img width="886" height="315" alt="image" src="https://github.com/user-attachments/assets/96151fbc-0114-49c8-b61f-6b498bcfc210" />

---

#### Generación automática del código

Codex analizó el requerimiento y generó automáticamente la lógica necesaria para:

* Solicitar permisos de ubicación.
* Obtener coordenadas GPS.
* Validar los datos obtenidos.
* Manejar errores de geolocalización.
* Mostrar información detallada de la ubicación.
* Diseñar una interfaz moderna acorde al tema GPS.

<img width="886" height="600" alt="image" src="https://github.com/user-attachments/assets/b49ee1a7-d051-45ac-b388-42c9d0dcf8f8" />

---

#### Ejecución del proyecto

Una vez finalizada la generación del código, se ejecutó la aplicación mediante:

```bash
ionic serve
```

Posteriormente se verificó el correcto funcionamiento de la interfaz y de la lectura GPS.

<img width="886" height="438" alt="image" src="https://github.com/user-attachments/assets/9df16ae5-e753-4184-8892-75ed1f061baa" />

---

### 2. Instalación de dependencias

```bash
npm install
npm install @capacitor/geolocation
```

---

### 3. Configuración de permisos Android

Archivo:

```xml
android/app/src/main/AndroidManifest.xml
```

Permisos agregados:

```xml
<uses-permission android:name="android.permission.INTERNET" />

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
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

### 5. Manejo de errores

La aplicación incorpora validaciones y control de errores para distintos escenarios:

---

## Interfaz principal

La interfaz permite al usuario:

* Obtener su ubicación actual
* Visualizar coordenadas GPS
* Consultar precisión de la lectura
* Revisar el estado de permisos
* Abrir la ubicación en Google Maps
* Copiar coordenadas

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

```bash
resources/
```

2. Agregar imagen:

```bash
icon.png
```

Resolución recomendada:

```bash
1024 x 1024 px
```

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

```xml
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

Crear archivo:

```xml
colors.xml
```

Contenido:

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

```bash
Build > Build Bundle(s) / APK(s) > Build APK(s)
```

---

## Capturas de la funcionalidad

| Splash Screen       | Ícono               |
| ------------------- | ------------------- |
| <img width="600" height="900" alt="WhatsApp Image 2026-06-24 at 10 07 38 PM" src="https://github.com/user-attachments/assets/6f209aca-53de-4584-8315-4943d6dfb036" />| <img width="600" height="900" alt="WhatsApp Image 2026-06-24 at 10 07 56 PM" src="https://github.com/user-attachments/assets/41697637-4739-4a7b-a3c3-6555d8542b6c" />
 |

| Ubicación obtenida con exito | Falla al obtener ubicación |
| ------------------- | ------------------- |
| <img width="600" height="1700" alt="WhatsApp Image 2026-06-24 at 9 40 31 PM" src="https://github.com/user-attachments/assets/6ab1ff9f-c3f7-47de-b133-b8f5b9f5ea93" />| <img width="600" height="1700" alt="WhatsApp Image 2026-06-24 at 9 40 31 PM (1)" src="https://github.com/user-attachments/assets/55b0d41c-1d4e-4bcc-874e-27f6231f1a79" />|


| Permisos GPS        | Google Maps         |
| ------------------- | ------------------- |
| <img width="600" height="900" alt="WhatsApp Image 2026-06-24 at 9 40 31 PM (2)" src="https://github.com/user-attachments/assets/163c1133-ee67-4665-ad6d-c53877fb93b9" />|<img width="600" height="900" alt="WhatsApp Image 2026-06-24 at 9 40 32 PM" src="https://github.com/user-attachments/assets/d1e8b5b1-3e27-4c41-b9dd-517f7436b145" /> |


---

## Video de funcionamiento


https://github.com/user-attachments/assets/1852aa87-a812-4034-a8eb-7b33f7fae3aa


---

## Resultados

* Se obtuvo correctamente la ubicación GPS del dispositivo.
* Se implementó la solicitud y validación de permisos de ubicación.
* Se visualizaron coordenadas geográficas precisas.
* Se integró apertura directa en Google Maps.
* Se implementó copia de coordenadas al portapapeles.
* APK funcional para dispositivos Android.
* Ícono y Splash Screen personalizados.
* Interfaz moderna y amigable para el usuario.
* Proyecto desarrollado con apoyo de Codex.
