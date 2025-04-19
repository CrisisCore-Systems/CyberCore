/**
 * Type definitions for the TraumaIndex system
 */

interface TraumaRelationMatrix {
  [traumaType: string]: {
    [relatedType: string]: number;
  };
}

interface TraumaKeywords {
  [traumaType: string]: string[];
}

interface TraumaTypeDescriptions {
  [traumaType: string]: string;
}

interface TraumaReference {
  count: number;
  keywords: string[];
}

interface TraumaReferences {
  [traumaType: string]: TraumaReference;
}

interface DominantTrauma {
  type: string | null;
  score: number;
}

interface TextAnalysisResult {
  dominant: DominantTrauma;
  references: TraumaReferences;
  intensity: number;
}

interface TraumaVectorData {
  types?: string[];
  relations?: TraumaRelationMatrix;
  keywords?: TraumaKeywords;
}

interface TraumaRelatedType {
  type: string;
  score: number;
}
