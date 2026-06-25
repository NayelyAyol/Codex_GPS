import { Component, OnDestroy, NgZone } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { Capacitor, PermissionState, registerPlugin } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';

import type {
  BackgroundGeolocationPlugin,
  Location,
  CallbackError,
} from '@capacitor-community/background-geolocation';

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation'
);

import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  checkmarkCircleOutline,
  compassOutline,
  copyOutline,
  locateOutline,
  mapOutline,
  navigateCircleOutline,
  openOutline,
  refreshOutline,
  shieldCheckmarkOutline,
  speedometerOutline,
  timeOutline,
  pauseCircleOutline,
  playCircleOutline,
  listOutline,
} from 'ionicons/icons';

type LocationViewState = 'idle' | 'checking' | 'ready' | 'denied' | 'error';

export interface HistoryEntry {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  source: 'foreground' | 'background';
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    IonBadge,
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab1Page implements OnDestroy {
  position?: Position;
  permissionState: PermissionState | 'unknown' = 'unknown';
  coarsePermissionState: PermissionState | 'unknown' = 'unknown';
  status: LocationViewState = 'idle';
  message = 'Listo para ubicarte';
  lastError = '';

  isTracking = false;
  locationHistory: HistoryEntry[] = [];
  showHistory = false;

  private bgWatcherId: string | null = null;
  // ID del watchPosition nativo del browser (solo se usa en ionic serve / web)
  private webWatcherId: number | null = null;

  constructor(private ngZone: NgZone) {
    addIcons({
      alertCircleOutline,
      checkmarkCircleOutline,
      compassOutline,
      copyOutline,
      locateOutline,
      mapOutline,
      navigateCircleOutline,
      openOutline,
      refreshOutline,
      shieldCheckmarkOutline,
      speedometerOutline,
      timeOutline,
      pauseCircleOutline,
      playCircleOutline,
      listOutline,
    });
  }

  get hasPosition(): boolean {
    return !!this.position;
  }

  get coordinatesText(): string {
    if (!this.position) return '';
    const { latitude, longitude } = this.position.coords;
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  get mapsUrl(): string {
    if (!this.position) return '';
    const { latitude, longitude } = this.position.coords;
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }

  async locateMe(): Promise<void> {
    this.status = 'checking';
    this.lastError = '';
    this.message = 'Validando permisos';

    try {
      await this.ensureLocationPermission();

      this.message = 'Leyendo senal GPS';
      const currentPosition = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      });

      this.validatePosition(currentPosition);
      this.position = currentPosition;
      this.status = 'ready';
      this.message = 'Ubicacion actualizada';

      this.addToHistory(
        currentPosition.coords.latitude,
        currentPosition.coords.longitude,
        currentPosition.coords.accuracy,
        currentPosition.timestamp,
        'foreground'
      );
    } catch (error) {
      this.handleLocationError(error);
    }
  }

  async startBackgroundTracking(): Promise<void> {
    if (this.isTracking) return;

    if (Capacitor.getPlatform() === 'web') {
      this.startWebTracking();
      return;
    }

    try {
      await this.ensureLocationPermission();

      console.log('permissionState:', this.permissionState);
console.log('coarsePermissionState:', this.coarsePermissionState);
      this.bgWatcherId = await BackgroundGeolocation.addWatcher(
        {
          backgroundMessage: 'Registrando tu ubicacion GPS en segundo plano',
          backgroundTitle: 'GPS Vivo Activo',
          requestPermissions: true,
          stale: false,
          distanceFilter: 10,
        },
        (location: Location | undefined, error: CallbackError | undefined) => {
          this.ngZone.run(() => {
            if (error) {
              if (error.code === 'NOT_AUTHORIZED') {
                this.status = 'denied';
                this.message = 'Permiso requerido';
                this.lastError =
                  'Activa el permiso de ubicacion "Siempre" para el seguimiento en segundo plano.';
                this.stopBackgroundTracking();
              }
              return;
            }

            
            if (!location) return;

            this.position = {
              coords: {
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
                altitude: location.altitude ?? null,
                altitudeAccuracy: location.altitudeAccuracy ?? null,
                heading: location.bearing ?? null,
                speed: location.speed ?? null,
                magneticHeading: undefined,
                trueHeading: undefined,
                headingAccuracy: undefined,
                course: undefined,
              },
              timestamp: location.time ?? Date.now(),
            };

            this.status = 'ready';
            this.message = location.simulated
              ? 'Ubicacion simulada'
              : 'Seguimiento activo';

            this.addToHistory(
              location.latitude,
              location.longitude,
              location.accuracy,
              location.time ?? Date.now(),
              'background'
            );
          });
        }
      );

      this.isTracking = true;
      this.message = 'Seguimiento iniciado';
    } catch (error) {
      this.handleLocationError(error);
      
    }
  }

  // ─── SEGUIMIENTO WEB (solo ionic serve) ──────────────────────────────────
  private startWebTracking(): void {
    if (!navigator.geolocation) {
      this.status = 'error';
      this.message = 'GPS no disponible';
      this.lastError = 'Este navegador no soporta geolocalización.';
      return;
    }

    this.webWatcherId = navigator.geolocation.watchPosition(
      (pos) => {
        this.ngZone.run(() => {
          this.position = {
            coords: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              altitude: pos.coords.altitude,
              altitudeAccuracy: pos.coords.altitudeAccuracy,
              heading: pos.coords.heading,
              speed: pos.coords.speed,
              magneticHeading: undefined,
              trueHeading: undefined,
              headingAccuracy: undefined,
              course: undefined,
            },
            timestamp: pos.timestamp,
          };
          this.status = 'ready';
          this.message = 'Seguimiento activo (web)';
          this.addToHistory(
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.accuracy,
            pos.timestamp,
            'foreground'
          );
        });
      },
      (err) => {
        this.ngZone.run(() => {
          this.stopWebTracking();
          if (err.code === err.PERMISSION_DENIED) {
            this.status = 'denied';
            this.message = 'Permiso requerido';
            this.lastError = 'Activa el permiso de ubicacion en el navegador.';
          } else {
            this.status = 'error';
            this.message = 'GPS no disponible';
            this.lastError = 'No se pudo obtener la ubicacion en el navegador.';
          }
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );

    this.isTracking = true;
    this.message = 'Seguimiento iniciado (web)';
  }

  private stopWebTracking(): void {
    if (this.webWatcherId !== null) {
      navigator.geolocation.clearWatch(this.webWatcherId);
      this.webWatcherId = null;
    }
    this.isTracking = false;
    this.message = this.position ? 'Seguimiento detenido' : 'Listo para ubicarte';
  }

  async stopBackgroundTracking(): Promise<void> {
    // Si estamos en web, detener el watchPosition del browser
    if (Capacitor.getPlatform() === 'web') {
      this.stopWebTracking();
      return;
    }

    if (this.bgWatcherId) {
      await BackgroundGeolocation.removeWatcher({ id: this.bgWatcherId });
      this.bgWatcherId = null;
    }
    this.isTracking = false;
    this.message = this.position ? 'Seguimiento detenido' : 'Listo para ubicarte';
  }

  toggleTracking(): void {
    if (this.isTracking) {
      this.stopBackgroundTracking();
    } else {
      this.startBackgroundTracking();
    }
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
  }

  clearHistory(): void {
    this.locationHistory = [];
  }

  private addToHistory(
    lat: number,
    lon: number,
    accuracy: number,
    timestamp: number,
    source: 'foreground' | 'background'
  ): void {
    this.locationHistory.unshift({ latitude: lat, longitude: lon, accuracy, timestamp, source });
    if (this.locationHistory.length > 50) {
      this.locationHistory = this.locationHistory.slice(0, 50);
    }
  }

  openInMaps(): void {
    if (!this.mapsUrl) return;
    window.open(this.mapsUrl, '_blank', 'noopener,noreferrer');
  }

  async copyCoordinates(): Promise<void> {
    if (!this.coordinatesText) return;
    try {
      await navigator.clipboard?.writeText(this.coordinatesText);
      this.message = 'Coordenadas copiadas';
    } catch {
      this.lastError = 'No se pudo copiar desde este navegador.';
      this.status = this.position ? 'ready' : 'error';
    }
  }

  private async ensureLocationPermission(): Promise<void> {
    const permissions = await Geolocation.checkPermissions();
      console.log('ANTES', this.permissionState);

    this.permissionState = permissions.location;
    this.coarsePermissionState = permissions.coarseLocation;

      console.log('DESPUES', this.permissionState);

    if (
      permissions.location === 'granted' ||
      permissions.coarseLocation === 'granted'
    ) {
      return;
    }

    if (
      permissions.location === 'denied' &&
      permissions.coarseLocation === 'denied'
    ) {
      throw new Error('LOCATION_PERMISSION_DENIED');
    }

    if (Capacitor.getPlatform() !== 'web') {
      const requested = await Geolocation.requestPermissions({
        permissions: ['location'],
      });
      this.permissionState = requested.location;
      this.coarsePermissionState = requested.coarseLocation;

      if (
        requested.location === 'denied' &&
        requested.coarseLocation === 'denied'
      ) {
        throw new Error('LOCATION_PERMISSION_DENIED');
      }
    }
  }

  translatePermission(state: PermissionState | 'unknown'): string {
    const map: Record<string, string> = {
      granted: 'Concedido',
      denied: 'Denegado',
      prompt: 'Pendiente',
      'prompt-with-rationale': 'Pendiente de confirmación',
      unknown: 'Desconocido',
    };
    return map[state] ?? state;
  }

  private validatePosition(position: Position): void {
    const { latitude, longitude, accuracy } = position.coords;
    const ok =
      Number.isFinite(latitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      Number.isFinite(longitude) &&
      longitude >= -180 &&
      longitude <= 180 &&
      Number.isFinite(accuracy) &&
      accuracy >= 0;

    if (!ok) throw new Error('INVALID_POSITION');
  }

  private handleLocationError(error: unknown): void {
    // Log en consola para facilitar depuración futura
    console.error('[GPS] Error:', error);

    const message = error instanceof Error ? error.message : String(error);

    if (
      message.includes('LOCATION_PERMISSION_DENIED') ||
      /permission|denied/i.test(message)
    ) {
      this.status = 'denied';
      this.message = 'Permiso requerido';
      this.lastError =
        'Activa el permiso de ubicacion para esta app y vuelve a intentar.';
      return;
    }

    if (/location services|disabled|unavailable/i.test(message)) {
      this.status = 'error';
      this.message = 'GPS no disponible';
      this.lastError = 'Revisa que la ubicacion del dispositivo este encendida.';
      return;
    }

    if (/timeout|timed out/i.test(message)) {
      this.status = 'error';
      this.message = 'Tiempo agotado';
      this.lastError =
        'No llego una lectura GPS estable. Intenta de nuevo en un lugar abierto.';
      return;
    }

    if (message.includes('INVALID_POSITION')) {
      this.status = 'error';
      this.message = 'Lectura invalida';
      this.lastError = 'El dispositivo devolvio coordenadas fuera de rango.';
      return;
    }

    // Fallback: muestra el mensaje real del error para facilitar diagnóstico
    this.status = 'error';
    this.message = 'No se pudo ubicar';
    this.lastError = `Error: ${message}`;
  }

  ngOnDestroy(): void {
    this.stopBackgroundTracking();
  }

}

