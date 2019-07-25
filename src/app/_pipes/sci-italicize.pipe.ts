import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sciItalicize'
})
export class SciItalicizePipe implements PipeTransform {
  private italic_words: string[] = [
    'Cryptosporidium parvum', 'Cryptosporidium hominis',
    'C. hominis', 'C. parvum', 'Cryptosporidium', 'Crypto ',
    'Wolbachia ',
    'Candida auris', 'Candida',
    'Balamuthia mandrillaris', 'Balamuthia',
    'Giardia lamblia', 'Giardia',
    'Trypanosoma cruzi', 'Trypanosoma',
    'Entamoeba histolytica', 'Entamoeba',
    'Naegleria fowleri', 'Naegleria',
    'Shigella flexneri', 'Shigella',
    'Acanthamoeba castellanii', 'Acanthamoeba',
    'Brugia malayi', 'B. malayi', 'Brugia pahangi', 'B. pahangi', 'Brugia',
    'Acinetobacter baumannii', 'A. baumannii', 'Acinetobacter',
    'Mycobacterium tuberculosis', 'M. tuberculosis', 'P.falciparum', 'P. falciparum',
    'M. smegmatis', 'in vivo', 'in vitro', 'In Situ', 'in situ', 'Drosophila'
  ];

  private micron_words: string[] = ['uM']

  transform(content) {
    if (content) {
      let content_xform = content;

      for (let word of this.micron_words) {
        // use global options to replace all w/i regex
        // italicize words
        content_xform = content_xform.replace(new RegExp(word, 'g'), this.micronize(word));
      }

      for (let word of this.italic_words) {
        // use global options to replace all w/i regex
        // italicize words
        content_xform = content_xform.replace(new RegExp(word, 'g'), this.italicize(word));
      }


      return `${content_xform}`;
    }
  }

  italicize(word: string) {
    return ("<em class='sci-italicize'>" + word + "</em>");
  }

  micronize(word: string) {
    return (word.replace('u', 'µ'));
  }

}
