import { Injectable } from '@angular/core';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {

  addScript(url : string): void {
    const scriptElement = document.createElement('script');
    scriptElement.src = url;
    document.body.appendChild(scriptElement);
  };

  addScripts(urls: string[]): void {
    urls.forEach(url => {
      this.addScript(url);
    });
  }
  
}