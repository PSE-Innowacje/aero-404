import { FormBuilder, FormGroup } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';

describe('dateRangeValidator', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('with proposedDateFrom/proposedDateTo', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = fb.group(
        { proposedDateFrom: [''], proposedDateTo: [''] },
        { validators: [dateRangeValidator('proposedDateFrom', 'proposedDateTo')] },
      );
    });

    it('should return null when both dates are empty', () => {
      form.patchValue({ proposedDateFrom: '', proposedDateTo: '' });
      expect(form.errors).toBeNull();
    });

    it('should return null when only from is set', () => {
      form.patchValue({ proposedDateFrom: '2026-04-01', proposedDateTo: '' });
      expect(form.errors).toBeNull();
    });

    it('should return null when from < to', () => {
      form.patchValue({ proposedDateFrom: '2026-04-01', proposedDateTo: '2026-04-10' });
      expect(form.errors).toBeNull();
    });

    it('should return null when from equals to', () => {
      form.patchValue({ proposedDateFrom: '2026-04-05', proposedDateTo: '2026-04-05' });
      expect(form.errors).toBeNull();
    });

    it('should return dateRange error when from > to', () => {
      form.patchValue({ proposedDateFrom: '2026-04-10', proposedDateTo: '2026-04-01' });
      expect(form.errors).toEqual({ dateRange: true });
      expect(form.get('proposedDateTo')?.hasError('dateRange')).toBe(true);
    });

    it('should clear dateRange error when dates are corrected', () => {
      form.patchValue({ proposedDateFrom: '2026-04-10', proposedDateTo: '2026-04-01' });
      expect(form.get('proposedDateTo')?.hasError('dateRange')).toBe(true);

      form.patchValue({ proposedDateFrom: '2026-04-01', proposedDateTo: '2026-04-10' });
      expect(form.get('proposedDateTo')?.hasError('dateRange')).toBe(false);
      expect(form.errors).toBeNull();
    });
  });

  describe('with plannedDeparture/plannedLanding', () => {
    let form: FormGroup;

    beforeEach(() => {
      form = fb.group(
        { plannedDeparture: [''], plannedLanding: [''] },
        { validators: [dateRangeValidator('plannedDeparture', 'plannedLanding')] },
      );
    });

    it('should return null when departure < landing', () => {
      form.patchValue({
        plannedDeparture: '2026-04-01T08:00',
        plannedLanding: '2026-04-01T12:00',
      });
      expect(form.errors).toBeNull();
    });

    it('should return dateRange error when departure > landing', () => {
      form.patchValue({
        plannedDeparture: '2026-04-01T14:00',
        plannedLanding: '2026-04-01T08:00',
      });
      expect(form.errors).toEqual({ dateRange: true });
      expect(form.get('plannedLanding')?.hasError('dateRange')).toBe(true);
    });

    it('should clear dateRange error when corrected', () => {
      form.patchValue({
        plannedDeparture: '2026-04-01T14:00',
        plannedLanding: '2026-04-01T08:00',
      });
      expect(form.get('plannedLanding')?.hasError('dateRange')).toBe(true);

      form.patchValue({
        plannedDeparture: '2026-04-01T08:00',
        plannedLanding: '2026-04-01T14:00',
      });
      expect(form.get('plannedLanding')?.hasError('dateRange')).toBe(false);
    });
  });
});
