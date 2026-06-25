import { Component } from '@angular/core';
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
import { Capacitor, PermissionState } from '@capacitor/core';
import { Geolocation, Position } from '@capacitor/geolocation';
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
} from 'ionicons/icons';

type LocationViewState = 'idle' | 'checking' | 'ready' | 'denied' | 'error';

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
export class Tab1Page {
  position?: Position;
  permissionState: PermissionState | 'unknown' = 'unknown';
  coarsePermissionState: PermissionState | 'unknown' = 'unknown';
  status: LocationViewState = 'idle';
  message = 'Listo para ubicarte';
  lastError = '';

  constructor() {
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
    });
  }

  get hasPosition(): boolean {
    return !!this.position;
  }

  get coordinatesText(): string {
    if (!this.position) {
      return '';
    }

    const { latitude, longitude } = this.position.coords;
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }

  get mapsUrl(): string {
    if (!this.position) {
      return '';
    }

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

      console.log(currentPosition);

      this.validatePosition(currentPosition);
      this.position = currentPosition;
      this.status = 'ready';
      this.message = 'Ubicacion actualizada';
    } catch (error) {
      this.handleLocationError(error);
    }
  }

  openInMaps(): void {
    if (!this.mapsUrl) {
      return;
    }

    window.open(this.mapsUrl, '_blank', 'noopener,noreferrer');
  }

  async copyCoordinates(): Promise<void> {
    if (!this.coordinatesText) {
      return;
    }

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
    this.permissionState = permissions.location;
    this.coarsePermissionState = permissions.coarseLocation;

    if (permissions.location === 'granted' || permissions.coarseLocation === 'granted') {
      return;
    }

    if (permissions.location === 'denied' && permissions.coarseLocation === 'denied') {
      throw new Error('LOCATION_PERMISSION_DENIED');
    }

    if (Capacitor.getPlatform() !== 'web') {
      const requested = await Geolocation.requestPermissions({
        permissions: ['location'],
      });
      this.permissionState = requested.location;
      this.coarsePermissionState = requested.coarseLocation;

      if (requested.location === 'denied' && requested.coarseLocation === 'denied') {
        throw new Error('LOCATION_PERMISSION_DENIED');
      }
    }
  }

  translatePermission(state: PermissionState | 'unknown'): string {
    const permissions: Record<string, string> = {
      granted: 'Concedido',
      denied: 'Denegado',
      prompt: 'Pendiente',
      'prompt-with-rationale': 'Pendiente de confirmación',
      unknown: 'Desconocido'
    };

    return permissions[state];
  }

  private validatePosition(position: Position): void {
    const { latitude, longitude, accuracy } = position.coords;
    const hasValidLatitude = Number.isFinite(latitude) && latitude >= -90 && latitude <= 90;
    const hasValidLongitude = Number.isFinite(longitude) && longitude >= -180 && longitude <= 180;
    const hasValidAccuracy = Number.isFinite(accuracy) && accuracy >= 0;

    if (!hasValidLatitude || !hasValidLongitude || !hasValidAccuracy) {
      throw new Error('INVALID_POSITION');
    }
  }

  private handleLocationError(error: unknown): void {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes('LOCATION_PERMISSION_DENIED') || /permission|denied/i.test(message)) {
      this.status = 'denied';
      this.message = 'Permiso requerido';
      this.lastError = 'Activa el permiso de ubicacion para esta app y vuelve a intentar.';
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
      this.lastError = 'No llego una lectura GPS estable. Intenta de nuevo en un lugar abierto.';
      return;
    }

    if (message.includes('INVALID_POSITION')) {
      this.status = 'error';
      this.message = 'Lectura invalida';
      this.lastError = 'El dispositivo devolvio coordenadas fuera de rango.';
      return;
    }

    this.status = 'error';
    this.message = 'No se pudo ubicar';
    this.lastError = 'Ocurrio un problema al leer la ubicacion actual.';
  }
  
}
