import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeCustomizer } from './theme-customizer';
import { SiteNav } from './site-nav';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, ThemeCustomizer, SiteNav],
  templateUrl: './app.html',
})
export class App {}
