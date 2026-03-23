# STATE MANAGEMENT

## Core Principle

Use the simplest state solution that solves the problem.
Do not introduce global state management unless local state is clearly insufficient.

---

## Decision Tree

```
Is the state used only in one component?
  → useState

Is the state shared between a parent and a few children?
  → useState + props (prop drilling up to 2 levels is fine)

Is the state complex with multiple sub-values that update together?
  → useReducer

Is the state shared across many unrelated components?
  → Context API (if simple) or Zustand (if complex)

Is the state server data (API responses)?
  → Hook + Service pattern (see data-pattern.md) — NOT global state
```

---

## Rules by state type

### Server state (API data)
- Always use **React Query** (`useQuery`, `useMutation`) via the Hook + Service pattern
- Do NOT store API responses in global state (Zustand/Context)
- React Query handles cache, loading, error, and stale state automatically

```ts
// hooks/useProducts.ts
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
}

// In component:
const { data, isLoading, error } = useProducts()
```

---

### UI state (local)
Use `useState` for:
- Toggle open/close (modal, dropdown, accordion)
- Active tab or step
- Form input values (when not using react-hook-form)
- Hover/focus states that JS needs to track

```ts
const [isOpen, setIsOpen] = useState(false)
const [activeTab, setActiveTab] = useState('overview')
```

---

### Form state
Always use `react-hook-form` for forms.
Shadcn's `Form` component is already built on top of it.

```ts
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
})
```

Do NOT manage form fields with `useState` manually.

---

### Complex local state
Use `useReducer` when:
- State has multiple fields that change together
- Transitions have names (e.g. `NEXT_STEP`, `RESET`)
- Logic is complex enough that `useState` creates many handlers

```ts
type State = { step: number; data: Partial<FormData> }
type Action = { type: 'NEXT'; payload: Partial<FormData> } | { type: 'RESET' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'NEXT': return { step: state.step + 1, data: { ...state.data, ...action.payload } }
    case 'RESET': return { step: 0, data: {} }
  }
}
```

---

### Shared UI state (Context)
Use React Context when:
- State is shared across many components in a subtree
- The state is simple (a theme, a user session, a locale)
- Updates are infrequent

```ts
// context/auth-context.tsx
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
```

Location: `context/<name>-context.tsx`

---

### Global client state (Zustand)
Use Zustand only when:
- State is shared across pages/routes (not just a subtree)
- Context re-renders would be a performance problem
- The state is truly global (cart, notifications, user preferences)

```ts
// store/cart.store.ts
import { create } from 'zustand'

type CartStore = {
  items: CartItem[]
  add: (item: CartItem) => void
  remove: (id: string) => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}))
```

Location: `store/<entity>.store.ts`

Install: `pnpm add zustand` (only add when needed, not by default)

---

## Summary table

| Use case | Solution | Location |
|----------|----------|----------|
| API data | Hook + Service | `hooks/` + `services/` |
| Form state | react-hook-form | inside component |
| Simple UI toggle | useState | inside component |
| Complex local state | useReducer | inside component |
| Shared subtree state | Context | `context/` |
| Global app state | Zustand | `store/` |

---

## Anti-patterns (FORBIDDEN)

- ❌ Storing API responses in Zustand (use hooks)
- ❌ Managing form fields with `useState` (use react-hook-form)
- ❌ Passing props more than 3 levels deep (use context)
- ❌ Using global state for data that is page-specific
- ❌ Adding Zustand before trying simpler solutions first
