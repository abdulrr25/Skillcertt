
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Certificate } from '@/lib/types';
import { sampleCertificates } from '@/lib/sample-data';

interface CertificateContextType {
  certificates: Certificate[];
  addCertificate: (certificate: Certificate) => void;
  isLoading: boolean;
}

const CertificateContext = createContext<CertificateContextType | undefined>(undefined);

export function CertificateProvider({ children }: { children: ReactNode }) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching initial certificates
    const timer = setTimeout(() => {
      // In a real app, you might fetch from a DB or local storage
      setCertificates(sampleCertificates);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const addCertificate = (certificate: Certificate) => {
    // Note: This adds the new certificate to the top of the list
    const updatedCerts = [certificate, ...certificates];
    setCertificates(updatedCerts);

    // In a real app, you would also persist this change
    // For the prototype, we add the new cert to the sample data array
    // so it can be found by the /verify page.
    sampleCertificates.unshift(certificate);
  };

  return (
    <CertificateContext.Provider value={{ certificates, addCertificate, isLoading }}>
      {children}
    </CertificateContext.Provider>
  );
}

export function useCertificates() {
  const context = useContext(CertificateContext);
  if (context === undefined) {
    throw new Error('useCertificates must be used within a CertificateProvider');
  }
  return context;
}
