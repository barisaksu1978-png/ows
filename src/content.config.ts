import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const localizedString = z.object({
  tr: z.string().optional(),
  en: z.string().optional(),
  ru: z.string().optional(),
  uk: z.string().optional(),
  el: z.string().optional(),
});

const dossiers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dossiers' }),
  schema: z.object({
    code: z.string(),
    status: z.enum(['active', 'under_review', 'quarantined', 'archived', 'locked']),
    version: z.string(),
    evidenceLevel: z.enum(['primary', 'institutional', 'secondary', 'mixed', 'unverified']),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    redTeamStatus: z.string(),
    updated: z.coerce.date(),
    relatedMaps: z.array(z.string()).default([]),
    relatedSources: z.array(z.string()).default([]),
    image: z.string().optional(),
    imageCaption: localizedString.optional(),
    title: localizedString,
    summary: localizedString,
  }),
});

const atlas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/atlas' }),
  schema: z.object({
    period: z.string(),
    source: z.string(),
    publisher: z.string().optional(),
    geography: z.string().optional(),
    image: z.string(),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
    relatedDossiers: z.array(z.string()).default([]),
    title: localizedString,
    summary: localizedString,
  }),
});

export const collections = { dossiers, atlas };
