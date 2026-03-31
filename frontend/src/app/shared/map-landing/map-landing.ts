import { AfterViewInit, Component, effect, ElementRef, input, viewChild } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

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

  private mapElement = viewChild.required<ElementRef<HTMLDivElement>>('mapElement');
  private map?: Map;
  private markerSource = new VectorSource();

  constructor() {
    effect(() => {
      const lat = this.latitude();
      const lon = this.longitude();
      if (!this.map) return;
      this.updateMarker(lat, lon);
    });
  }

  ngAfterViewInit(): void {
    this.map = new Map({
      target: this.mapElement().nativeElement,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: this.markerSource }),
      ],
      view: new View({
        center: fromLonLat(POLAND_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
    });

    const lat = this.latitude();
    const lon = this.longitude();
    this.updateMarker(lat, lon);
  }

  private updateMarker(lat: number | undefined, lon: number | undefined): void {
    this.markerSource.clear();
    const hasCoords =
      lat !== undefined && lon !== undefined && !isNaN(lat) && !isNaN(lon);

    if (hasCoords) {
      const marker = new Feature({ geometry: new Point(fromLonLat([lon, lat])) });
      marker.setStyle(MARKER_STYLE);
      this.markerSource.addFeature(marker);
      this.map!.getView().animate({ center: fromLonLat([lon, lat]), zoom: MARKER_ZOOM, duration: 300 });
    } else {
      this.map!.getView().animate({ center: fromLonLat(POLAND_CENTER), zoom: DEFAULT_ZOOM, duration: 300 });
    }
  }
}
