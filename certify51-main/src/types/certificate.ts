// Certificate types
export interface Student {
  name: string;
  registrationNumber: string;
}

export interface TextPosition {
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
}

export interface CertificateConfig {
  namePosition: TextPosition;
  regNumberPosition: TextPosition;
}
