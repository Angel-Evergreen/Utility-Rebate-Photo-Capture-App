import React, { createContext, ReactNode, useContext, useState } from 'react';

export type Service = {
  id: string;
  name: string;
  required: boolean;
};

export const SERVICES: Service[] = [
  { id: 'air-seal', name: 'Air Seal', required: true },
  { id: 'alarm-photo', name: 'Alarm Photo', required: true },
  { id: 'attic-section', name: 'Attic Section', required: false },
  { id: 'crawlspace-section', name: 'Crawlspace Section', required: false },
  { id: 'wall-section', name: 'Wall Section', required: false },
  { id: 'duct-mastic', name: 'Duct Mastic', required: false },
  { id: 'duct-sealing', name: 'Duct Sealing', required: false },
];

type PhotoData = {
  uri: string;
  timestamp: number;
};

type AppContextType = {
  crewName: string;
  setCrewName: (name: string) => void;
  completedServices: Set<string>;
  addCompletedService: (serviceId: string) => void;
  isServiceCompleted: (serviceId: string) => boolean;
  allRequiredServicesCompleted: () => boolean;
  resetApp: () => void;
  servicePhotos: Map<string, PhotoData[]>;
  addPhoto: (serviceId: string, uri: string) => void;
  getServicePhotos: (serviceId: string) => PhotoData[];
  clearServicePhotos: (serviceId: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [crewName, setCrewName] = useState('');
  const [completedServices, setCompletedServices] = useState<Set<string>>(
    new Set()
  );
  const [servicePhotos, setServicePhotos] = useState<Map<string, PhotoData[]>>(
    new Map()
  );

  const addCompletedService = (serviceId: string) => {
    setCompletedServices((prev) => new Set([...prev, serviceId]));
  };

  const isServiceCompleted = (serviceId: string) => {
    return completedServices.has(serviceId);
  };

  const allRequiredServicesCompleted = () => {
    const requiredServices = SERVICES.filter((s) => s.required);
    return requiredServices.every((service) =>
      completedServices.has(service.id)
    );
  };

  const addPhoto = (serviceId: string, uri: string) => {
    setServicePhotos((prev) => {
      const newMap = new Map(prev);
      const photos = newMap.get(serviceId) || [];
      newMap.set(serviceId, [
        ...photos,
        { uri, timestamp: Date.now() },
      ]);
      return newMap;
    });
  };

  const getServicePhotos = (serviceId: string): PhotoData[] => {
    return servicePhotos.get(serviceId) || [];
  };

  const clearServicePhotos = (serviceId: string) => {
    setServicePhotos((prev) => {
      const newMap = new Map(prev);
      newMap.delete(serviceId);
      return newMap;
    });
  };

  const resetApp = () => {
    setCrewName('');
    setCompletedServices(new Set());
    setServicePhotos(new Map());
  };

  return (
    <AppContext.Provider
      value={{
        crewName,
        setCrewName,
        completedServices,
        addCompletedService,
        isServiceCompleted,
        allRequiredServicesCompleted,
        resetApp,
        servicePhotos,
        addPhoto,
        getServicePhotos,
        clearServicePhotos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
