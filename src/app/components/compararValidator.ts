import { AbstractControl, ValidatorFn } from '@angular/forms';

export function compararValidator(inputName: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const isValid = control.value === control.root.get(inputName)?.value;
    return isValid ? null : { invalidFormat: { value: control.value } };
  };
}