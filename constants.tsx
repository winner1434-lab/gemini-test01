
import { Property, ExternalEvent, User, UserRole } from './types';

export const MOCK_USER_AM: User = {
  id: 'am-1',
  username: 'account_manager_01',
  role: UserRole.AM,
  managedPropertyIds: ['p1', 'p2']
};

export const MOCK_USER_ADMIN: User = {
  id: 'admin-1',
  username: 'system_admin',
  role: UserRole.ADMIN,
  managedPropertyIds: [] // Can see everything
};

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    name: 'Taipei Garden View B&B',
    district: 'Xinyi',
    lat: 25.0330,
    lng: 121.5654,
    rooms: [
      { id: 'r1', name: 'Deluxe Double', basePrice: 3200 },
      { id: 'r2', name: 'Family Suite', basePrice: 5800 }
    ]
  },
  {
    id: 'p2',
    name: 'Harbor Breeze Hostel',
    district: 'Keelung',
    lat: 25.1276,
    lng: 121.7392,
    rooms: [
      { id: 'r3', name: 'Dorm Bed', basePrice: 800 },
      { id: 'r4', name: 'Private Room', basePrice: 1500 }
    ]
  },
  {
    id: 'p3',
    name: 'Mountain Retreat Lodge',
    district: 'Beitou',
    lat: 25.1360,
    lng: 121.5064,
    rooms: [
      { id: 'r5', name: 'Zen Cabin', basePrice: 4500 }
    ]
  }
];

export const MOCK_EVENTS: ExternalEvent[] = [
  {
    id: 'e1',
    name: 'Mayday 2024 World Tour Concert',
    date: '2024-12-25',
    venue: 'Taipei Arena',
    lat: 25.0511,
    lng: 121.5505,
    scale: 'HIGH',
    source: 'Crawler-01'
  },
  {
    id: 'e2',
    name: 'Global Tech Expo',
    date: '2024-12-20',
    venue: 'Nangang Exhibition Center',
    lat: 25.0569,
    lng: 121.6174,
    scale: 'MEDIUM',
    source: 'Crawler-01'
  }
];
