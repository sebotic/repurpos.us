import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class StructureService {

  constructor(private ngZone: NgZone) { }

  // Observable string sources
  private structureAnnouncedSource = new Subject<string>();
  private submitPressedSource = new Subject<boolean>();

  // Observable string streams
  structureAnnounced$ = this.structureAnnouncedSource.asObservable();
  submitPressed$ = this.submitPressedSource.asObservable();

  // Service message commands
  // Announce that structure has been set
  announceStructure(structure: string) {
    this.ngZone.run(() => this.structureAnnouncedSource.next(structure));
  }

  // anncounce that submit button has been pressed
  announceSubmit(pressed: boolean) {
    this.submitPressedSource.next(pressed);
  }

}
