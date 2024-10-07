import { Check } from 'lucide-react'

import * as Popover from '@radix-ui/react-popover'
import { useEffect, useState } from 'react'
import { useDebounceValue } from 'usehooks-ts'
import { searchUsers } from './api'

interface User {
  id: string
  name: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

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


  return (
    <form className="h-screen flex flex-col gap-6 items-center justify-center">
      <Popover.Root>
        <Popover.Trigger>
          <button type="button" className="w-64 h-10 px-3 border text-left rounded">
            {selectedUser?.name || 'Buscar usuário'}
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
                onClick={() => setSelectedUser(user)}
                className="w-full text-left h-8 rounded px-2 flex items-center justify-between hover:bg-gray-100" 
                type="button" 
              >
                {user.name}

                {selectedUser?.id === user.id && <Check className="size-4 text-emerald-400" />}
              </button>
            )
          })}
        </Popover.Content>
      </Popover.Root>
    </form>
  )
}
