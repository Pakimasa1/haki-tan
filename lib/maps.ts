import type { Map } from '@/types'

export const CS2_MAPS: Map[] = [
  {
    id: 'mirage',
    name: 'Mirage',
    image: 'https://static.wikia.nocookie.net/cswikia/images/2/26/Csgo_mirage.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_mirage/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_mirage/radar.png',
  },
  {
    id: 'dust2',
    name: 'Dust2',
    image: 'https://static.wikia.nocookie.net/cswikia/images/9/97/Cs2_dust2.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_dust2/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_dust2/radar.png',
  },
  {
    id: 'inferno',
    name: 'Inferno',
    image: 'https://static.wikia.nocookie.net/cswikia/images/f/f9/Csgo_inferno.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_inferno/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_inferno/radar.png',
  },
  {
    id: 'nuke',
    name: 'Nuke',
    image: 'https://static.wikia.nocookie.net/cswikia/images/5/55/Csgo_nuke.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_nuke/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_nuke/radar.png',
  },
  {
    id: 'overpass',
    name: 'Overpass',
    image: 'https://static.wikia.nocookie.net/cswikia/images/c/cb/Csgo_overpass.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_overpass/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_overpass/radar.png',
  },
  {
    id: 'ancient',
    name: 'Ancient',
    image: 'https://static.wikia.nocookie.net/cswikia/images/1/1b/Csgo_ancient.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_ancient/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_ancient/radar.png',
  },
  {
    id: 'anubis',
    name: 'Anubis',
    image: 'https://static.wikia.nocookie.net/cswikia/images/6/64/Csgo_anubis.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_anubis/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_anubis/radar.png',
  },
  {
    id: 'train',
    name: 'Train',
    image: 'https://static.wikia.nocookie.net/cswikia/images/b/b9/Csgo_train.png',
    radarT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_train/radar.png',
    radarCT: 'https://raw.githubusercontent.com/zool/cs2-map-images/main/maps/de_train/radar.png',
  },
]

export function getMapById(id: string): Map | undefined {
  return CS2_MAPS.find((m) => m.id === id)
}

export const LINEUP_COLORS = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
]
