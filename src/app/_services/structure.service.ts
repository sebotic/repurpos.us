import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()

export class StructureService {

  // constructor() { }

  // Observable string sources
  private structureAnnouncedSource = new Subject<string>();
  private submitPressedSource = new Subject<boolean>();

  // Observable string streams
  structureAnnounced$ = this.structureAnnouncedSource.asObservable();
  submitPressed$ = this.submitPressedSource.asObservable();

  // Service message commands
  announceStructure(structure: string) {
  console.log('within svc, setting struct')
  console.log(structure)
    this.structureAnnouncedSource.next(structure);
  }

  announceSubmit(pressed: boolean) {
    console.log('getting pressed from announceSubmit()')
    console.log(pressed)
    this.submitPressedSource.next(pressed);
  }

}
