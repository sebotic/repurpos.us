export class Schema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  identifier: string;
  inLanguage: string;
  license?: string;
  publisher: Organization;
  includedInDataCatalog: DataCatalog;
  distribution: DataDownload[];
  url?: string;
  creator: Person[];
  citation: string;
  keywords: string[];
  measurementTechnique?: string[];
  variableMeasured?: string;
  dateModified?: string;
  version?: string;
  funding?: any;
  funder?: Organization;
}

export class Organization {
  "@context": string;
  "@type": string;
  name: string;
  url?: string;
  location?: string;
  alternateName?: string;
}

export class DataCatalog {
  "@context": string;
  "@type": string;
  name: string;
  url: string;
  description: string;
  funding: Funding[];
}

export class DataDownload {
  "@context": string;
  "@type": string;
  contentUrl: string;
  encodingFormat: string[];
}

export class Person {
  "@context": string;
  "@type": string;
  name: string;
  affiliation?: Organization;
  givenName?: string;
  familyName?: string;
}

export class Funding {
  "@type": string;
  identifier?: string;
  funder: Organization;
}
