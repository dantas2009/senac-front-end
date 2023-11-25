import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(private meta: Meta) { }

  addMetaTag(name: string, content: string): void {
    this.meta.addTag({ name, content });
  }

  removeMetaTag(name: string): void {
    this.meta.removeTag(`name='${name}'`);
  }
}