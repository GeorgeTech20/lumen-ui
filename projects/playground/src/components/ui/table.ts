import { Directive, computed, input } from '@angular/core';
import { cn } from '@/lib/utils';

/** Table part directives (helm). Native <table> semantics + skin. */
@Directive({ selector: 'table[signngTable]', host: { '[class]': 'cls()' } })
export class Table {
  readonly class = input('');
  protected readonly cls = computed(() => cn('w-full caption-bottom text-sm', this.class()));
}

@Directive({ selector: 'thead[signngTableHeader]', host: { '[class]': 'cls()' } })
export class TableHeader {
  readonly class = input('');
  protected readonly cls = computed(() => cn('[&_tr]:border-b', this.class()));
}

@Directive({ selector: 'tbody[signngTableBody]', host: { '[class]': 'cls()' } })
export class TableBody {
  readonly class = input('');
  protected readonly cls = computed(() => cn('[&_tr:last-child]:border-0', this.class()));
}

@Directive({ selector: 'tr[signngTableRow]', host: { '[class]': 'cls()' } })
export class TableRow {
  readonly class = input('');
  protected readonly cls = computed(() =>
    cn('border-b border-border transition-colors hover:bg-muted/50', this.class()),
  );
}

@Directive({ selector: 'th[signngTableHead]', host: { '[class]': 'cls()' } })
export class TableHead {
  readonly class = input('');
  protected readonly cls = computed(() =>
    cn('h-12 px-4 text-left align-middle font-medium text-muted-foreground', this.class()),
  );
}

@Directive({ selector: 'td[signngTableCell]', host: { '[class]': 'cls()' } })
export class TableCell {
  readonly class = input('');
  protected readonly cls = computed(() => cn('p-4 align-middle', this.class()));
}

export const SIGNNG_TABLE = [Table, TableHeader, TableBody, TableRow, TableHead, TableCell] as const;
