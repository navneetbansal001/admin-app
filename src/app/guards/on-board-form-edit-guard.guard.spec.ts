import { TestBed, async, inject } from '@angular/core/testing';

import { OnBoardFormEditGuardGuard } from './on-board-form-edit-guard.guard';

describe('OnBoardFormEditGuardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnBoardFormEditGuardGuard]
    });
  });

  it('should ...', inject([OnBoardFormEditGuardGuard], (guard: OnBoardFormEditGuardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
