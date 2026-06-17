import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog } from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { SIGNNG_TABS } from '@signng/core/tabs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Slider, Switch, Checkbox, Input, Label, Dialog, Tooltip, ...SIGNNG_TABS],
  templateUrl: './app.html',
})
export class App {
  protected readonly volume = signal(40);
  protected readonly selectedTab = signal<string>('overview');
  protected readonly notifications = signal(true);
  protected readonly terms = signal(false);
}
