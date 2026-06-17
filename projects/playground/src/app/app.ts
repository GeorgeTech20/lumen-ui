import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, Radio } from '@/components/ui/radio-group';
import { Dialog } from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { Popover } from '@/components/ui/popover';
import { Accordion } from '@/components/ui/accordion';
import { Select } from '@/components/ui/select';
import { SIGNNG_TABS } from '@signng/core/tabs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Button, Slider, Switch, Checkbox, Input, Label, Textarea,
    RadioGroup, Radio, Dialog, Tooltip, Popover, Accordion, Select, ...SIGNNG_TABS,
  ],
  templateUrl: './app.html',
})
export class App {
  protected readonly volume = signal(40);
  protected readonly selectedTab = signal<string>('overview');
  protected readonly notifications = signal(true);
  protected readonly terms = signal(false);
  protected readonly plan = signal<string | null>('free');
  protected readonly country = signal<string | null>(null);

  protected readonly faq = [
    { value: 'a', title: '¿Qué es signng?', content: 'Librería de componentes Angular signals-native.' },
    { value: 'b', title: '¿Es accesible?', content: 'Sí — WCAG 2.2 AA, axe en CI, a11y heredada de @angular/aria.' },
    { value: 'c', title: '¿Cómo se instala?', content: 'Por CLI con verificación de firma + SRI.' },
  ];
  protected readonly countries = [
    { value: 'pe', label: 'Perú' },
    { value: 'mx', label: 'México' },
    { value: 'ar', label: 'Argentina' },
  ];
}
