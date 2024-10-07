import * as Popover from "@radix-ui/react-popover"
import { Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useDebounceValue } from "usehooks-ts"
import { searchUsers } from "./api"

interface User {
  id: string
  name: string
}

interface SelectUserProps {
  onValueChange: (user: User) => void
  value: User | null
}

export function SelectUser({ onValueChange, value }: SelectUserProps) {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [debouncedSearch] = useDebounceValue(search, 500)

  useEffect(() => {
    if (!debouncedSearch) {
      // Limpa a lista de usuários se não houver nada na busca
      setUsers([])
      return
    }

    setIsSearching(true)

    searchUsers(debouncedSearch)
      .then(data => setUsers(data))
      .finally(() => setIsSearching(false))
  }, [debouncedSearch])

  function handleSelectUser(user: User) {
    onValueChange(user)
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button type="button" className="w-64 h-10 px-3 border text-left rounded">
          {value?.name || 'Buscar usuário'}
        </button>
      </Popover.Trigger>

      <Popover.Content sideOffset={6} style={{ width: 'var(--radix-popover-trigger-width)' }} className="px-1 py-2 border rounded space-y-1">
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder='Buscar usuário...' 
          className="w-full outline-none px-2 border-b mb-1 pb-2"
        />

        {isSearching ? (
          <p className="text-gray-400 px-2">Buscando...</p>
        ) : users.map(user => {
          return (
            <button 
              key={user.id}
              onClick={() => handleSelectUser(user)}
              className="w-full text-left h-8 rounded px-2 flex items-center justify-between hover:bg-gray-100" 
              type="button" 
            >
              {user.name}

              {value?.id === user.id && <Check className="size-4 text-emerald-400" />}
            </button>
          )
        })}
      </Popover.Content>
    </Popover.Root>
  )
}