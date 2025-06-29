'use server';
/**
 * @fileOverview An AI flow for analyzing certificate documents.
 *
 * - analyzeCertificate - A function that handles the certificate analysis process.
 * - AnalyzeCertificateInput - The input type for the analyzeCertificate function.
 * - AnalyzeCertificateOutput - The return type for the analyzeCertificate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCertificateInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a certificate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCertificateInput = z.infer<typeof AnalyzeCertificateInputSchema>;

const AnalyzeCertificateOutputSchema = z.object({
  title: z.string().describe('The main title of the certificate or achievement.'),
  issuer: z.string().describe('The name of the organization that issued the certificate.'),
  date: z.string().describe('The date of completion or issuance, in YYYY-MM-DD format.'),
});
export type AnalyzeCertificateOutput = z.infer<typeof AnalyzeCertificateOutputSchema>;

export async function analyzeCertificate(input: AnalyzeCertificateInput): Promise<AnalyzeCertificateOutput> {
  return analyzeCertificateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCertificatePrompt',
  input: {schema: AnalyzeCertificateInputSchema},
  output: {schema: AnalyzeCertificateOutputSchema},
  prompt: `You are an expert OCR and data extraction agent. Your task is to analyze the provided image of a certificate document.

Carefully examine the document and extract the following three pieces of information:
1.  The primary title of the certificate (e.g., "Advanced Solana Development", "Certificate of Completion").
2.  The name of the issuing body or organization (e.g., "Solana University", "SmartContract.com").
3.  The date the certificate was completed or issued. You MUST format this date as YYYY-MM-DD. If you see a month name, convert it to its numeric equivalent.

Return the extracted information in the specified JSON format.

Document for analysis: {{media url=photoDataUri}}`,
});

const analyzeCertificateFlow = ai.defineFlow(
  {
    name: 'analyzeCertificateFlow',
    inputSchema: AnalyzeCertificateInputSchema,
    outputSchema: AnalyzeCertificateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
