// coerce assay dataset metadata into schema.org format
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { Organization, DataCatalog, DataDownload, Person } from '../_models';

import { flatMap } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class SchemaService {
  // Static vars across all datasets
  license = "https://creativecommons.org/licenses/by/4.0";
  publisher: Organization = {
    "@context": "http://schema.org/",
    "@type": "Organization",
    name: "Scripps Research",
    url: "https://www.scripps.edu/",
    location: "La Jolla, CA"
  };

  dataCatalog: DataCatalog = {
    "@context": "http://schema.org/",
    "@type": "DataCatalog",
    "name": environment.site_name,
    "url": environment.url,
    "description": environment.description
  }

  constructor() {
  }

  // Methods to pull out specific pieces and coerce them into a format for schema.org

  prepDistribution(assay_id): DataDownload[] {
    let distribution = {
      "@context": "http://schema.org/",
      "@type": "DataDownload",
      "encodingFormat": ["text/csv", "text/tsv", "text/json"],
      "contentUrl": `${environment.url}assays/${assay_id}`
    };
    // return as an array of distribution objects for download.
    return ([distribution])
  }

  prepTechs(assay_type) {
    return (assay_type.split(",").map(d => d.trim()));
  }

  prepKeywords(datasetObj): string[] {
    let keywords = ["drug repurposing"];

    keywords.push(datasetObj.indication);

    keywords = keywords.concat(this.prepTechs(datasetObj.assay_type));

    return (keywords)
  }

  prepAuthors(authorString: string): Person[] {
    let authorGroups = authorString.split(";");

    let authors = authorGroups.map(this.getAuthor);

    return (flatMap(authors, d => d));
  }

  getAuthor(authorString: string): Person[] {
    let authorLocation = authorString.match(/\((.+)\)$/);
    let affiliation = null;
    let locationName = null;

    if (authorLocation) {
      let locations = authorLocation[1].split(",");
      affiliation = locations[0].trim();
      locationName = locations.slice(1).join(", ").replace(/\s+/g, " ").trim();
      authorString = authorString.replace(`(${authorLocation[1]})`, "").replace(/, PhD/g, " PhD");
    }

    let authors = authorString.split(",").map(author => {
      return ({
        "@context": "http://schema.org/",
        "@type": "Person",
        name: author.replace(" PhD", ", PhD").trim(),
        affiliation: {
          "@context": "http://schema.org/",
          "@type": "Organization",
          name: affiliation,
          location: locationName
        }
      })
    })
    return (authors)
  }
}
