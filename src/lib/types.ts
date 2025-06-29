export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  ipfsHash: string;
  transactionHash: string;
  previewUrl?: string;
  dataAiHint?: string;
  userName?: string;
  fileType?: string;
};
