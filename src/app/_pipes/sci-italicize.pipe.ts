import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sciItalicize'
})
export class SciItalicizePipe implements PipeTransform {
  private italic_words: string[] = [
    'Cryptosporidium parvum', 'Cryptosporidium hominis',
    'C. hominis', 'C. parvum','Cryptosporidium','Crypto',
   'Wolbachia',
   'Mycobacterium tuberculosis', 'M. tuberculosis', 'P.falciparum', 'P. falciparum',
  'M. smegmatis',  'in vivo', 'in vitro',
];

  transform(content) {
    let content_xform = content;

    for(let word of this.italic_words) {
      // use global options to replace all w/i regex
      content_xform = content_xform.replace(new RegExp(word, 'g'), this.italicize(word));
    }


     return `${content_xform}`;
   }

   italicize(word: string) {
     return("<em>" + word + "</em>");
   }

}
