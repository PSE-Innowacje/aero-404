import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat, toLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Translate from 'ol/interaction/Translate';

const POLAND_CENTER: [number, number] = [19.1451, 51.9194];
const DEFAULT_ZOOM = 6;
const MARKER_ZOOM = 14;

const MARKER_STYLE = new Style({
  image: new CircleStyle({
    radius: 8,
    fill: new Fill({ color: '#e53935' }),
    stroke: new Stroke({ color: '#fff', width: 2 }),
  }),
});

@Component({
  selector: 'app-map-landing',
  template: '<div #mapElement class="map-container"></div>',
  styleUrl: './map-landing.scss',
})
export class MapLandingComponent implements AfterViewInit {
  latitude = input<number | undefined>();
  longitude = input<number | undefined>();
  coordinatesChange = output<{ latitude: number; longitude: number }>();

  private mapElement = viewChild.required<ElementRef<HTMLDivElement>>('mapElement');
  private map?: Map;
  private markerSource = new VectorSource();
  private markerLayer = new VectorLayer({ source: this.markerSource });
  private skipNextUpdate = false;

  constructor() {
    effect(() => {
      const lat = this.latitude();
      const lon = this.longitude();
      if (!this.map) return;
      if (this.skipNextUpdate) {
        this.skipNextUpdate = false;
        return;
      }
      this.updateMarker(lat, lon);
    });
  }

  ngAfterViewInit(): void {
    this.map = new Map({
      target: this.mapElement().nativeElement,
      layers: [new TileLayer({ source: new OSM() }), this.markerLayer],
      view: new View({
        center: fromLonLat(POLAND_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
    });

    const translate = new Translate({ layers: [this.markerLayer] });
    translate.on('translateend', (e) => {
      const geometry = e.features.item(0)?.getGeometry() as Point | undefined;
      if (!geometry) return;
      const [lon, lat] = toLonLat(geometry.getCoordinates());
      this.skipNextUpdate = true;
      this.coordinatesChange.emit({
        latitude: Math.round(lat * 1e6) / 1e6,
        longitude: Math.round(lon * 1e6) / 1e6,
      });
    });
    this.map.addInteraction(translate);

    this.updateMarker(this.latitude(), this.longitude());
  }

  private updateMarker(lat: number | undefined, lon: number | undefined): void {
    this.markerSource.clear();
    const hasCoords = lat !== undefined && lon !== undefined && !isNaN(lat) && !isNaN(lon);

    if (hasCoords) {
      const marker = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
      marker.setStyle(MARKER_STYLE);
      this.markerSource.addFeature(marker);
      this.map!.getView().animate({ center: fromLonLat([lon, lat]), zoom: MARKER_ZOOM, duration: 300 });
    } else {
      const marker = new Feature({ geometry: new Point(fromLonLat(POLAND_CENTER)) });
      marker.setStyle(MARKER_STYLE);
      this.markerSource.addFeature(marker);
      this.map!.getView().animate({ center: fromLonLat(POLAND_CENTER), zoom: DEFAULT_ZOOM, duration: 300 });
    }
  }
}
