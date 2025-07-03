# FileHunt Demo

Une application de démonstration construite avec Next.js, TypeScript, Tailwind CSS et Radix UI.

## Technologies utilisées

- **Next.js 15** - Framework React avec App Router
- **TypeScript** - Typage statique pour JavaScript
- **Tailwind CSS v4** - Framework CSS utilitaire
- **Radix UI** - Composants UI accessibles et sans style
- **Lucide React** - Icônes modernes

## Démarrage rapide

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

## Composants disponibles

### Button
Composant bouton avec plusieurs variantes et tailles :
- Variantes : `default`, `secondary`, `outline`, `ghost`, `link`, `destructive`
- Tailles : `sm`, `default`, `lg`, `icon`

```tsx
import { Button } from "@/components/button";

<Button variant="outline" size="sm">
  Cliquez-moi
</Button>
```

### Card
Composant carte composé de plusieurs parties :
- `Card` - Container principal
- `CardHeader` - En-tête avec titre et description
- `CardContent` - Contenu principal
- `CardFooter` - Pied de page avec actions

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card";

<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Contenu de la carte</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog
Composant modal accessible :
- `Dialog` - Container principal
- `DialogTrigger` - Élément déclencheur
- `DialogContent` - Contenu de la modal
- `DialogHeader`, `DialogFooter` - Sections structurelles

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dialog";

<Dialog>
  <DialogTrigger asChild>
    <Button>Ouvrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Titre</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button>Confirmer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu
Menu déroulant contextuel :
- `DropdownMenu` - Container principal
- `DropdownMenuTrigger` - Élément déclencheur
- `DropdownMenuContent` - Contenu du menu
- `DropdownMenuItem` - Élément de menu
- `DropdownMenuLabel`, `DropdownMenuSeparator` - Éléments structurels

```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Option 1</DropdownMenuItem>
    <DropdownMenuItem>Option 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Structure du projet

```
src/
├── app/
│   ├── globals.css          # Styles globaux et variables de couleur
│   ├── layout.tsx          # Layout principal de l'application
│   └── page.tsx            # Page de démonstration
├── components/
│   ├── button.tsx          # Composant Button
│   ├── card.tsx            # Composant Card
│   ├── dialog.tsx          # Composant Dialog
│   ├── dropdown-menu.tsx   # Composant Dropdown Menu
│   └── index.ts            # Exports des composants
└── lib/
    └── utils.ts            # Utilitaires (fusion de classes CSS)
```

## Thèmes

L'application supporte automatiquement les thèmes clair et sombre selon les préférences système. Les couleurs sont définies dans `globals.css` avec des variables CSS personnalisées.

## Scripts disponibles

```bash
# Développement
npm run dev

# Construction pour la production
npm run build

# Démarrage du serveur de production
npm start

# Linting
npm run lint
```
