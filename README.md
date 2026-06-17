# signng — Fase 0 (rebanada vertical)

POC que valida la tesis del análisis: **"DX estilo shadcn, estilada sobre `@angular/aria`,
signals-native, con distribución firmada/verificada"** — la cuña que ningún incumbente
(spartan, ng-primitives) ocupa todavía.

No es una librería terminada. Es la **tubería end-to-end** probada con un primitivo de cada
clase, para de-riesgar antes de construir los 32 ítems del MVP.

## Arquitectura (3 capas)

```
tokens/        DTCG (oklch) -> Style Dictionary v5 -> Tailwind v4 @theme + dark   (Capa 3)
registry/      helm copy-paste source (button, slider) + builder con SRI sha256   (Capa 2 distribución)
packages/cli/  @signng/cli — add/init con SRI verify + sandbox + dry-run/diff   (Capa 2 seguridad)
projects/signng/core/   @signng/core  (ng-packagr, APF, secondary entry points)
   ├─ primitives/  safeMerge (anti proto-pollution) + isSafeUrl (anti XSS/redirect)
   ├─ slider/      primitivo net-new: role=slider, teclado, drag, alternativa no-drag  (Capa 1)
   └─ tabs/        adapter sobre @angular/aria (aísla churn Dev Preview)
projects/playground/      app consumidora (SSR + zoneless) que consume todo
e2e/           Playwright + axe-core (WCAG 2.2 AA) + prueba de seguridad fail-closed
```

## Qué quedó probado

| Claim del análisis | Evidencia en este repo |
|---|---|
| APF + secondary entry points tree-shakeable, signals-only | `ng build @signng/core` ✔ (3 entradas) |
| Primitivo a11y net-new (Slider) bajo SSR + hidratación | axe 0 violaciones + teclado 40→41→51→0→100 ✔ |
| Heredar a11y de `@angular/aria` (Tabs) vía adapter | roles/selección aria ✔, 1 archivo aísla el churn |
| Seguridad horneada (proto-pollution, URL allowlist) | 9 unit tests adversariales ✔ |
| Theming oklch portable (drop-in tweakcn) | editar solo `signng-theme.css` re-tematiza, axe sigue AA ✔ |
| Distribución **firmada** + verificada + sandboxeada (la cuña enterprise) | Ed25519 sobre el manifest + SRI por item + CLI **fail-closed** 9/9 (tamper/firma/signer/traversal/http) ✔ |

## Fase 1A — seguridad (cerrada)

| Pieza | Estado |
|---|---|
| Firma Ed25519 del registry + verify contra signer **pineado** + cross-check SRI | ✔ runnable (`registry:build` firma, `signng add` verifica) |
| `security:lint` (banea `bypassSecurityTrust*`/innerHTML/eval) | ✔ 27 files, 0 sinks |
| Prueba adversarial fail-closed | ✔ 9/9 (`security:test`) |
| Packages publicables | ✔ `npm pack --dry-run`: core 14 files / cli 2 files |
| SBOM CycloneDX 1.5 | ✔ `sbom.cyclonedx.json` (10 components) |
| CI: ci/CodeQL/OSV/release(OIDC+provenance) + Semgrep + SECURITY.md + security.txt | ✔ autorado |
| **cosign/Sigstore keyless** | ⚙ integración cableada (`tools/cosign.mjs`, `release.yml`); corre en CI o con cosign instalado. Mismo property que Ed25519 (verify-before-write + pinning) |
| **publish npm real** | ⛔ gated externamente (necesita org npm + trusted publisher); dry-run probado |

## Correr todo

```bash
pnpm install
pnpm verify:all          # core + unit + tokens + signed registry + lint + fail-closed + playground + a11y
pnpm run sbom            # CycloneDX SBOM
pnpm cli:build           # bundle CLI -> packages/cli/dist/index.mjs
pnpm publish:dry         # npm pack --dry-run (core + cli)
```

Individuales: `pnpm tokens:build` · `pnpm registry:build` ·
`pnpm signng add button slider --cwd projects/playground --dry-run` ·
`pnpm a11y` · `pnpm security:lint` · `pnpm security:test` · `pnpm verify:cosign` (si cosign instalado)

## Diferido (post-Fase 1A)

cosign keyless real en CI + publish npm vivo (gated externamente), los otros 10 primitivos
+ 18 componentes, Storybook/Compodoc, MCP server, marketplace de temas. Análisis completo en
`~/.claude/plans/analiza-la-creacion-de-glowing-glacier.md`.
