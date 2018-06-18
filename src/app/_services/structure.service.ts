import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class StructureService {
  acetaminophen: string =
    // from ChEBI
    [
      "",
      "Mrv0541 10231312482D  1   1.00000     0.00000     0 ",
      "",
      " 11 11  0  0  0  0            999 V2000",
      "    0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000    0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000   -0.8250    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -0.7145   -0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "   -0.7145    0.4125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    1.4288    1.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.7145    2.0624    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.7145    2.8874    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000    1.6500    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
      "    0.0000   -1.6499    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0",
      "  2  1  1  0  0  0  0",
      "  1  3  2  0  0  0  0",
      " 10  3  1  0  0  0  0",
      "  4  2  2  0  0  0  0",
      "  4 11  1  0  0  0  0",
      "  4  5  1  0  0  0  0",
      "  6  5  2  0  0  0  0",
      "  3  6  1  0  0  0  0",
      "  7  8  1  0  0  0  0",
      "  8  9  2  0  0  0  0",
      "  8 10  1  0  0  0  0",
      "M  END"
    ].join("\n");

  milciclib_core: string = [
    "",
    "Ketcher  6131813262D 1   1.00000     0.00000     0",
    "",
    " 31 35  0     0  0            999 V2000",
    "    3.6456   -1.2314    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    3.7918   -2.0434    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0",
    "    2.8693   -0.9521    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "    9.2891    1.8322    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   10.1137    1.8064    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   10.5037    1.0794    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   10.0691    0.3782    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    9.2445    0.4040    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    8.8545    1.1310    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    8.0299    1.1567    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "    7.5953    0.4555    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    6.7707    0.4813    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "    7.5506   -0.9728    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    7.9853   -0.2715    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "    6.7260   -0.9470    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    6.3361   -0.2200    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    5.4668   -1.6225    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    6.2914   -1.6482    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    5.0769   -0.8955    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    5.5115   -0.1942    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    4.9788    0.4358    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "    4.2151    0.1240    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "    4.2756   -0.6988    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "    5.1755    1.2370    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   11.3283    1.0537    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "   11.7629    1.7549    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   12.5875    1.7292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   12.9775    1.0022    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0",
    "   12.5429    0.3009    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   11.7183    0.3267    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "   13.8021    0.9764    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0",
    "  9  4  1  0     0  0",
    " 15 18  1  0     0  0",
    " 16 20  1  0     0  0",
    " 19 17  1  0     0  0",
    " 17 18  1  0     0  0",
    " 19 20  2  0     0  0",
    "  1  3  1  0     0  0",
    "  9 10  1  0     0  0",
    "  5  6  1  0     0  0",
    " 10 11  1  0     0  0",
    "  1  2  2  0     0  0",
    " 20 21  1  0     0  0",
    " 21 22  1  0     0  0",
    " 22 23  2  0     0  0",
    " 23 19  1  0     0  0",
    " 11 12  2  0     0  0",
    " 21 24  1  0     0  0",
    " 23  1  1  0     0  0",
    " 25 26  1  0     0  0",
    " 12 16  1  0     0  0",
    "  6  7  2  0     0  0",
    " 15 13  1  0     0  0",
    " 13 14  2  0     0  0",
    " 14 11  1  0     0  0",
    " 25 30  1  0     0  0",
    " 26 27  1  0     0  0",
    " 27 28  1  0     0  0",
    " 28 29  1  0     0  0",
    " 29 30  1  0     0  0",
    "  6 25  1  0     0  0",
    " 15 16  2  0     0  0",
    " 28 31  1  0     0  0",
    "  7  8  1  0     0  0",
    "  4  5  2  0     0  0",
    "  8  9  2  0     0  0",
    "M  END"
  ].join("\n");

  constructor(private ngZone: NgZone) { }

  // Observable string sources
  private smilesAnnouncedSource = new Subject<string>();
  private molfileAnnouncedSource = new Subject<string>();
  private modeAnnouncedSource = new Subject<string>();
  private tanimotoAnnouncedSource = new Subject<number>();
  private submitAnnouncedSource = new Subject<boolean>();

  // Observable string streams
  smilesAnnounced$ = this.smilesAnnouncedSource.asObservable();
  molfileAnnounced$ = this.molfileAnnouncedSource.asObservable();
  modeAnnounced$ = this.modeAnnouncedSource.asObservable();
  tanimotoAnnounced$ = this.tanimotoAnnouncedSource.asObservable();
  submitAnnounced$ = this.submitAnnouncedSource.asObservable();

  // Service message commands
  // Announce that structure has been set
  announceSmiles(smiles: string, submitted: boolean) {
    // console.log('announcing smiles')
    // console.log(smiles)
    this.ngZone.run(() => this.smilesAnnouncedSource.next(smiles));

    // If the query has been submitted, also return back the structure of the compound
    if (submitted) {
      if (smiles !== '') {
        // TODO: call to convert SMILES --> molfile
        this.molfileAnnouncedSource.next(this.acetaminophen);

        this.submitAnnouncedSource.next(true);
      } else {
        this.molfileAnnouncedSource.next('');
        this.submitAnnouncedSource.next(false);
      }
    }
  }

  announceMode(mode: string) {
    this.modeAnnouncedSource.next(mode);
  }

  announceTanimoto(tm_thresh: number) {
    this.tanimotoAnnouncedSource.next(tm_thresh);
  }

}
