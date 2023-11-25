import { AbstractControl, ValidatorFn } from '@angular/forms';

export function regexValidator(regex: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = regex.test(control.value);
    return isValid ? null : { invalidFormat: { value: control.value } };
  };
}