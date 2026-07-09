/**
 * Single source of truth for the component list — consumed by Showcase (grid + Código tab)
 * and DocsPage (sidebar + per-component page). Keeping this in one file means adding a
 * component updates both surfaces at once instead of drifting out of sync.
 */
export interface Demo {
  name: string;
  cat: string;
  code: string;
}

export const CATS = ['Enterprise', 'Avanzados', 'Pro', 'Formularios', 'Overlays', 'Navegación', 'Datos', 'Display', 'Gráficos'];

export const DEMOS: Demo[] = [
  { name: 'DataTable', cat: 'Enterprise', code: `<signng-data-table [data]="rows" [columns]="cols" [selectable]="true" groupBy="dept" />` },
  { name: 'MultiLineChart', cat: 'Enterprise', code: `<signng-multi-line-chart [series]="series" [labels]="labels" />` },
  { name: 'StackedBarChart', cat: 'Enterprise', code: `<signng-stacked-bar-chart [series]="series" [labels]="labels" />` },
  { name: 'GroupedBarChart', cat: 'Enterprise', code: `<signng-grouped-bar-chart [series]="series" [labels]="labels" />` },
  { name: 'ScatterChart', cat: 'Enterprise', code: `<signng-scatter-chart [data]="points" />` },
  { name: 'Heatmap', cat: 'Enterprise', code: `<signng-heatmap [matrix]="matrix" />` },
  { name: 'FileUpload', cat: 'Enterprise', code: `<signng-file-upload accept="image/*,.pdf" [maxSize]="5242880" (filesChange)="f=$event" />` },
  { name: 'ImageUpload', cat: 'Enterprise', code: `<signng-image-upload [multiple]="true" (filesChange)="imgs=$event" />` },
  { name: 'LoginForm', cat: 'Enterprise', code: `<signng-login-form mode="login" [social]="true" (submitted)="onLogin($event)" />` },

  { name: 'StatCard', cat: 'Avanzados', code: `<signng-stat-card label="MRR" [value]="'$48.2k'" delta="+12%" [up]="true" icon="trending" />` },
  { name: 'Stepper', cat: 'Avanzados', code: `<signng-stepper [steps]="steps" [(current)]="step" [clickable]="true" />` },
  { name: 'NumberInput', cat: 'Avanzados', code: `<signng-number-input [(value)]="qty" [min]="0" prefix="$" />` },
  { name: 'MultiSelect', cat: 'Avanzados', code: `<signng-multi-select [options]="opts" [(value)]="selected" />` },
  { name: 'TagInput', cat: 'Avanzados', code: `<signng-tag-input [(tags)]="tags" />` },
  { name: 'DateRangePicker', cat: 'Avanzados', code: `<signng-date-range-picker [(start)]="from" [(end)]="to" />` },
  { name: 'TreeView', cat: 'Avanzados', code: `<signng-tree-view [nodes]="tree" [defaultOpen]="true" />` },
  { name: 'Timeline', cat: 'Avanzados', code: `<signng-timeline [items]="feed" />` },
  { name: 'EmptyState', cat: 'Avanzados', code: `<signng-empty-state title="Sin datos" icon="search">…</signng-empty-state>` },
  { name: 'Toolbar', cat: 'Avanzados', code: `<signng-toolbar label="Formato">\n  <button signngToolbarItem signngToggle>B</button>\n  <span signngToolbarSeparator></span>\n  <button signngToolbarItem signngButton size="sm">Exportar</button>\n</signng-toolbar>` },
  { name: 'Transfer', cat: 'Avanzados', code: `<signng-transfer [items]="items" [(selected)]="sel" />` },
  { name: 'Descriptions', cat: 'Avanzados', code: `<signng-descriptions [items]="fields" [columns]="2" [bordered]="true" />` },

  { name: 'Kanban', cat: 'Pro', code: `<signng-kanban [(columns)]="board" (moved)="onMove($event)" />` },
  { name: 'NotificationCenter', cat: 'Pro', code: `<signng-notification-center [(items)]="notifs" />` },
  { name: 'Rating', cat: 'Pro', code: `<signng-rating [(value)]="stars" [max]="5" />` },
  { name: 'ColorPicker', cat: 'Pro', code: `<signng-color-picker [(value)]="brand" />` },

  { name: 'Button', cat: 'Formularios', code: `<button signngButton variant="default">Botón</button>` },
  { name: 'Input', cat: 'Formularios', code: `<input signngInput placeholder="email@ejemplo.com" />` },
  { name: 'Textarea', cat: 'Formularios', code: `<textarea signngTextarea placeholder="Mensaje…"></textarea>` },
  { name: 'Switch', cat: 'Formularios', code: `<signng-switch [(checked)]="on" />` },
  { name: 'Checkbox', cat: 'Formularios', code: `<signng-checkbox [(checked)]="ok" />` },
  { name: 'RadioGroup', cat: 'Formularios', code: `<signng-radio-group [(value)]="v">\n  <signng-radio value="a">A</signng-radio>\n</signng-radio-group>` },
  { name: 'Select', cat: 'Formularios', code: `<signng-select [options]="regions" [(value)]="region" />` },
  { name: 'Slider', cat: 'Formularios', code: `<signng-slider [(value)]="n" [min]="0" [max]="100" />` },
  { name: 'Combobox', cat: 'Formularios', code: `<signng-combobox [options]="frameworks" [(value)]="fw" />` },
  { name: 'InputOtp', cat: 'Formularios', code: `<signng-input-otp [(value)]="code" [length]="4" />` },
  { name: 'FormField', cat: 'Formularios', code: `<signng-form-field label="Nombre" description="Tu nombre">\n  <input signngInput />\n</signng-form-field>` },
  { name: 'Toggle', cat: 'Formularios', code: `<signng-toggle [(pressed)]="b">B</signng-toggle>` },
  { name: 'ToggleGroup', cat: 'Formularios', code: `<signng-toggle-group [(value)]="v">…</signng-toggle-group>` },
  { name: 'Segmented', cat: 'Formularios', code: `<signng-segmented [options]="opts" [(value)]="view" />` },
  { name: 'Form', cat: 'Formularios', code: `<form [formGroup]="f">\n  <signng-field [control]="f.controls.email" label="Email" [required]="true">\n    <input signngInput formControlName="email" />\n  </signng-field>\n</form>` },
  { name: 'RangeSlider', cat: 'Formularios', code: `<signng-range-slider [(value)]="range" [min]="0" [max]="100" />` },

  { name: 'Dialog', cat: 'Overlays', code: `<signng-dialog title="Confirmar" triggerLabel="Abrir">…</signng-dialog>` },
  { name: 'AlertDialog', cat: 'Overlays', code: `<signng-alert-dialog title="¿Eliminar?" …>…</signng-alert-dialog>` },
  { name: 'Sheet', cat: 'Overlays', code: `<signng-sheet side="right" triggerLabel="Abrir">…</signng-sheet>` },
  { name: 'Drawer', cat: 'Overlays', code: `<signng-drawer triggerLabel="Abrir">…</signng-drawer>` },
  { name: 'Popover', cat: 'Overlays', code: `<signng-popover triggerLabel="Abrir">…</signng-popover>` },
  { name: 'Tooltip', cat: 'Overlays', code: `<signng-tooltip text="Ayuda"><button signngButton>?</button></signng-tooltip>` },
  { name: 'HoverCard', cat: 'Overlays', code: `<signng-hover-card>…</signng-hover-card>` },
  { name: 'Command', cat: 'Overlays', code: `<signng-command [commands]="cmds" />` },
  { name: 'Toast', cat: 'Overlays', code: `inject(ToastService).success('Guardado')` },

  { name: 'Tabs', cat: 'Navegación', code: `<signng-tabs>…</signng-tabs>` },
  { name: 'Accordion', cat: 'Navegación', code: `<signng-accordion [items]="faq" />` },
  { name: 'DropdownMenu', cat: 'Navegación', code: `<signng-dropdown-menu [items]="items" />` },
  { name: 'ContextMenu', cat: 'Navegación', code: `<signng-context-menu [items]="items">…</signng-context-menu>` },
  { name: 'Menubar', cat: 'Navegación', code: `<signng-menubar [menus]="bar" />` },
  { name: 'NavigationMenu', cat: 'Navegación', code: `<signng-navigation-menu>…</signng-navigation-menu>` },
  { name: 'Breadcrumb', cat: 'Navegación', code: `<nav signngBreadcrumb>…</nav>` },
  { name: 'Pagination', cat: 'Navegación', code: `<signng-pagination [(page)]="p" [total]="10" />` },
  { name: 'Sidebar', cat: 'Navegación', code: `<signng-sidebar>…</signng-sidebar>` },

  { name: 'Calendar', cat: 'Datos', code: `<signng-calendar [(value)]="date" />` },
  { name: 'DatePicker', cat: 'Datos', code: `<signng-date-picker [(value)]="date" />` },
  { name: 'TimePicker', cat: 'Datos', code: `<signng-time-picker [(value)]="time" [minuteStep]="5" />` },
  { name: 'Table', cat: 'Datos', code: `<table signngTable>…</table>` },

  { name: 'Card', cat: 'Display', code: `<div signngCard>…</div>` },
  { name: 'Badge', cat: 'Display', code: `<span signngBadge variant="default">Nuevo</span>` },
  { name: 'Avatar', cat: 'Display', code: `<signng-avatar fallback="GF" />` },
  { name: 'Alert', cat: 'Display', code: `<div signngAlert>…</div>` },
  { name: 'Separator', cat: 'Display', code: `<div signngSeparator></div>` },
  { name: 'Skeleton', cat: 'Display', code: `<signng-skeleton class="h-4 w-40" />` },
  { name: 'Progress', cat: 'Display', code: `<signng-progress [value]="62" />` },
  { name: 'Spinner', cat: 'Display', code: `<signng-spinner [size]="24" label="Cargando" />` },
  { name: 'Code', cat: 'Display', code: `<signng-code [code]="snippet" />  <!-- siempre oscuro, light + dark, con copiar -->` },
  { name: 'Collapsible', cat: 'Display', code: `<signng-collapsible triggerLabel="Ver más">…</signng-collapsible>` },
  { name: 'ScrollArea', cat: 'Display', code: `<signng-scroll-area>…</signng-scroll-area>` },
  { name: 'AspectRatio', cat: 'Display', code: `<signng-aspect-ratio [ratio]="16/9">…</signng-aspect-ratio>` },
  { name: 'Carousel', cat: 'Display', code: `<signng-carousel>…</signng-carousel>` },
  { name: 'Icon', cat: 'Display', code: `<signng-icon name="heart" [size]="20" />` },

  { name: 'BarChart', cat: 'Gráficos', code: `<signng-bar-chart [data]="bars" [height]="180" />` },
  { name: 'LineChart', cat: 'Gráficos', code: `<signng-line-chart [data]="bars" [height]="180" />` },
  { name: 'DonutChart', cat: 'Gráficos', code: `<signng-donut-chart [data]="parts" />` },
  { name: 'RadialChart', cat: 'Gráficos', code: `<signng-radial-chart [value]="72" [max]="100" />` },
];

// Demos whose registry item doesn't match a plain kebab-case of the demo name.
const REGISTRY_ITEM: Record<string, string> = {
  BarChart: 'chart', LineChart: 'chart', AreaChart: 'chart', DonutChart: 'chart',
  PieChart: 'chart', RadialChart: 'chart', Sparkline: 'chart',
  MultiLineChart: 'chart-analytics', StackedBarChart: 'chart-analytics',
  GroupedBarChart: 'chart-analytics', ScatterChart: 'chart-analytics', Heatmap: 'chart-analytics',
  ImageUpload: 'file-upload',
};

export function registryItemFor(name: string): string {
  return REGISTRY_ITEM[name] ?? name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export interface RegistryFile {
  path: string;
  content: string;
  integrity: string;
}
export interface RegistryItem {
  name: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
  integrity: string;
}

const registryCache = new Map<string, Promise<RegistryItem | null>>();

/** Fetches a registry item's full JSON (source + metadata) from /r, cached per item name. */
export function fetchRegistryItem(demoName: string): Promise<RegistryItem | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const item = registryItemFor(demoName);
  let p = registryCache.get(item);
  if (!p) {
    p = fetch(`/r/${item}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
    registryCache.set(item, p);
  }
  return p;
}
