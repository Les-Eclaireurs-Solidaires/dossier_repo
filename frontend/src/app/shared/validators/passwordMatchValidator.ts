import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchFieldsValidator(
  sourceControlName: string,
  targetControlName: string,
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const sourceControl = group.get(sourceControlName);
    const targetControl = group.get(targetControlName);
    if (!sourceControl || !targetControl) return null;
    return sourceControl.value === targetControl.value ? null : { fieldsMismatch: true };
  };
}
