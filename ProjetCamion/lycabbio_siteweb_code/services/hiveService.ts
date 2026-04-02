import { HiveData } from '../types';

const DATA_URL = 'https://lycabbio.fr/PHP/currentData.php';

const generateMockData = (): HiveData[] => {
  const baseStats = [
    { id: 1, weight: 25.5, temp: 34.2, hum: 60 },
    { id: 2, weight: 24.8, temp: 33.5, hum: 62 },
    { id: 3, weight: 26.1, temp: 35.0, hum: 58 },
    { id: 4, weight: 23.9, temp: 32.8, hum: 65 },
    { id: 5, weight: 25.2, temp: 34.5, hum: 61 },
    { id: 6, weight: 24.5, temp: 33.2, hum: 63 },
    { id: 7, weight: 26.5, temp: 35.5, hum: 57 },
    { id: 8, weight: 23.5, temp: 32.5, hum: 66 },
    { id: 9, weight: 25.8, temp: 34.8, hum: 59 },
  ];

  return baseStats.map(stat => ({
    id: stat.id,
    name: `Ruche ${stat.id}`,
    temperature: stat.temp,
    humidity: stat.hum,
    weight: stat.weight,
    status: (stat.temp < 25 || stat.temp > 38) ? 'warning' : 'optimal',
    lastUpdated: new Date()
  }));
};

export const fetchHiveData = async (): Promise<HiveData[]> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Increased timeout

    const response = await fetch(DATA_URL, { 
      signal: controller.signal,
      cache: 'no-store' // Ensure we get fresh data
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    
    // The PHP script returns { data: [...] }
    if (rawData && Array.isArray(rawData.data)) {
      return rawData.data.map((item: any, index: number) => {
        // Parse fields from the specific format: "idRuche", "masse", "temperature", "humidite"
        const id = parseInt(item.idRuche) || (index + 1);
        const weight = parseFloat(item.masse);
        const temp = parseFloat(item.temperature);
        const humidity = parseFloat(item.humidite);
        
        // Parse date "27\/01\/2026" and time "20h59m"
        const dateStr = item.date ? item.date.replace(/\\/g, '') : '';
        const timeStr = item.heure ? item.heure.replace('h', ':').replace('m', '') : '';
        
        let lastUpdated = new Date();
        if (dateStr && timeStr) {
            try {
              const [day, month, year] = dateStr.split('/');
              const [hours, minutes] = timeStr.split(':');
              lastUpdated = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
            } catch (e) {
              console.warn("Date parsing error", e);
            }
        }

        // Professional status logic
        let status: 'optimal' | 'warning' | 'critical' = 'optimal';
        if (temp < 10 || temp > 42) status = 'critical';
        else if (temp < 25 || temp > 38) status = 'warning';
        
        if (humidity > 90) status = 'warning';

        return {
          id: id,
          name: `Ruche ${id}`,
          temperature: isNaN(temp) ? 0 : temp,
          humidity: isNaN(humidity) ? 0 : humidity,
          weight: isNaN(weight) ? 0 : weight,
          status: status,
          lastUpdated: lastUpdated
        };
      });
    }
    
    throw new Error("Invalid data structure");

  } catch (error) {
    console.warn("Could not fetch live data from Lycabbio. Using simulation data.", error);
    return generateMockData();
  }
};