import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
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
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

const POLAND_CENTER: [number, number] = [19.1451, 51.9194];
const DEFAULT_ZOOM = 6;

const POINT_STYLE = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: '#1976d2' }),
    stroke: new Stroke({ color: '#fff', width: 2 }),
  }),
});

const LINE_STYLE = new Style({
  stroke: new Stroke({ color: '#1976d2', width: 3 }),
});

@Component({
  selector: 'app-map-route',
  template: '<div #mapElement class="map-container"></div>',
  styleUrl: './map-route.scss',
})
export class MapRouteComponent implements AfterViewInit {
  points = input<[number, number][]>([]);

  private mapElement = viewChild.required<ElementRef<HTMLDivElement>>('mapElement');
  private map?: Map;
  private vectorSource = new VectorSource();

  constructor() {
    effect(() => {
      const pts = this.points();
      if (this.map) {
        this.updateRoute(pts);
      }
    });
  }

  ngAfterViewInit(): void {
    this.map = new Map({
      target: this.mapElement().nativeElement,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: this.vectorSource }),
      ],
      view: new View({
        center: fromLonLat(POLAND_CENTER),
        zoom: DEFAULT_ZOOM,
      }),
    });

    this.updateRoute(this.points());
  }

  private updateRoute(points: [number, number][]): void {
    this.vectorSource.clear();
    if (!points || points.length === 0) return;

    const coords = points.map(([lat, lon]) => fromLonLat([lon, lat]));

    for (const coord of coords) {
      const pointFeature = new Feature({ geometry: new Point(coord) });
      pointFeature.setStyle(POINT_STYLE);
      this.vectorSource.addFeature(pointFeature);
    }

    if (coords.length > 1) {
      const lineFeature = new Feature({ geometry: new LineString(coords) });
      lineFeature.setStyle(LINE_STYLE);
      this.vectorSource.addFeature(lineFeature);
    }

    const extent = this.vectorSource.getExtent();
    if (extent && extent[0] !== Infinity) {
      this.map!.getView().fit(extent as [number, number, number, number], {
        padding: [40, 40, 40, 40],
        maxZoom: 16,
        duration: 300,
      });
    }
  }
}
